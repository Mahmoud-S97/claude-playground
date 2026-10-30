import mongoose from "mongoose";
import Todo, { MAX_SUBTASKS, MAX_TITLE_LENGTH } from "../models/Todo.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const SUBTASK_FIELDS = ["title", "priority", "completed", "dueAt"];

// Thrown for request problems we detect ourselves; carries a message code.
class BadRequestError extends Error {
  constructor(code, params) {
    super(code);
    this.code = code;
    this.params = params;
  }
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

// Copies only the subtask fields the client is allowed to set.
function pickSubtaskFields(input = {}) {
  const fields = {};
  for (const key of SUBTASK_FIELDS) {
    if (input[key] !== undefined) fields[key] = input[key];
  }
  return fields;
}

// The create form always sends its slots. Keep only filled ones (title +
// date), drop fully empty ones, and reject a slot that has a date but no title.
function filledSubtasksFromSlots(slots) {
  const filled = [];
  for (const slot of Array.isArray(slots) ? slots : []) {
    const title = typeof slot?.title === "string" ? slot.title.trim() : "";
    const hasDate = hasValue(slot?.dueAt);

    if (!title && !hasDate) continue;
    if (!title) throw new BadRequestError("SUBTASK_DATE_WITHOUT_TITLE");
    if (!hasDate) throw new BadRequestError("SUBTASK_DUE_DATE_REQUIRED");

    filled.push({ ...pickSubtaskFields(slot), title });
  }

  if (filled.length === 0) throw new BadRequestError("SUBTASK_REQUIRED");
  if (filled.length > MAX_SUBTASKS) {
    throw new BadRequestError("SUBTASK_LIMIT_REACHED", { max: MAX_SUBTASKS });
  }
  return filled;
}

// Turns a Mongoose validation error into one of our message codes, preferring
// the most specific field error (e.g. "subtasks.1.title" -> SUBTASK_TITLE_REQUIRED).
function codeForValidationError(error) {
  const fieldErrors = Object.entries(error.errors);

  for (const [path, fieldError] of fieldErrors) {
    if (path === "subtasks") continue;
    const field = path.split(".").pop();
    const isSubtask = path.startsWith("subtasks.");

    if (field === "title" && fieldError.kind === "required") {
      return { code: isSubtask ? "SUBTASK_TITLE_REQUIRED" : "TODO_TITLE_REQUIRED" };
    }
    if (field === "title" && fieldError.kind === "maxlength") {
      return { code: "TITLE_TOO_LONG", params: { max: MAX_TITLE_LENGTH } };
    }
    if (field === "priority") return { code: "INVALID_PRIORITY" };
    if (field === "dueAt") {
      return { code: fieldError.kind === "required" ? "SUBTASK_DUE_DATE_REQUIRED" : "INVALID_DUE_DATE" };
    }
  }

  if (error.errors.subtasks) {
    return { code: "SUBTASK_COUNT_INVALID", params: { max: MAX_SUBTASKS } };
  }
  return { code: "INVALID_TODO_DATA" };
}

function handleError(req, res, error, action) {
  if (error instanceof BadRequestError) {
    return sendError(req, res, 400, error.code, error.params);
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const { code, params } = codeForValidationError(error);
    return sendError(req, res, 400, code, params);
  }
  console.error(`Failed to ${action}:`, error);
  return sendError(req, res, 500, "SERVER_ERROR");
}

function findOwnTodo(req) {
  if (!mongoose.isValidObjectId(req.params.id)) return null;
  return Todo.findOne({ _id: req.params.id, userId: req.user._id });
}

// A plain read: returns just the array, no message.
export async function listTodos(req, res) {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: 1 });
    return res.status(200).json(todos);
  } catch (error) {
    return handleError(req, res, error, "list todos");
  }
}

export async function createTodo(req, res) {
  try {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      throw new BadRequestError("TODO_TITLE_REQUIRED");
    }

    const todo = await Todo.create({
      userId: req.user._id,
      title: req.body.title,
      priority: req.body.priority,
      subtasks: filledSubtasksFromSlots(req.body.subtasks),
    });
    return sendSuccess(req, res, 201, "TODO_CREATED", { todo });
  } catch (error) {
    return handleError(req, res, error, "create todo");
  }
}

// Card-level fields only; subtasks have their own routes below.
export async function updateTodo(req, res) {
  try {
    const todo = await findOwnTodo(req);
    if (!todo) return sendError(req, res, 404, "TODO_NOT_FOUND");

    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.priority !== undefined) todo.priority = req.body.priority;
    await todo.save();
    return sendSuccess(req, res, 200, "TODO_UPDATED", { todo });
  } catch (error) {
    return handleError(req, res, error, "update todo");
  }
}

export async function deleteTodo(req, res) {
  try {
    const deleted = mongoose.isValidObjectId(req.params.id)
      ? await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
      : null;
    if (!deleted) return sendError(req, res, 404, "TODO_NOT_FOUND");
    return sendSuccess(req, res, 200, "TODO_DELETED");
  } catch (error) {
    return handleError(req, res, error, "delete todo");
  }
}

// Appends a new subtask (like Array#push), up to MAX_SUBTASKS per card.
export async function addSubtask(req, res) {
  try {
    const todo = await findOwnTodo(req);
    if (!todo) return sendError(req, res, 404, "TODO_NOT_FOUND");

    if (todo.subtasks.length >= MAX_SUBTASKS) {
      return sendError(req, res, 400, "SUBTASK_LIMIT_REACHED", { max: MAX_SUBTASKS });
    }

    todo.subtasks.push(pickSubtaskFields(req.body));
    await todo.save();
    return sendSuccess(req, res, 201, "SUBTASK_ADDED", { todo });
  } catch (error) {
    return handleError(req, res, error, "add subtask");
  }
}

// Edits any field of one existing subtask, e.g. just its date. The schema
// rejects clearing its title or date.
export async function updateSubtask(req, res) {
  try {
    const todo = await findOwnTodo(req);
    if (!todo) return sendError(req, res, 404, "TODO_NOT_FOUND");

    const subtask = mongoose.isValidObjectId(req.params.subtaskId)
      ? todo.subtasks.id(req.params.subtaskId)
      : null;
    if (!subtask) return sendError(req, res, 404, "SUBTASK_NOT_FOUND");

    subtask.set(pickSubtaskFields(req.body));
    await todo.save();
    return sendSuccess(req, res, 200, "SUBTASK_UPDATED", { todo });
  } catch (error) {
    return handleError(req, res, error, "update subtask");
  }
}

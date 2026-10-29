import mongoose from "mongoose";
import Todo, { MAX_SUBTASKS } from "../models/Todo.js";

const SUBTASK_FIELDS = ["title", "priority", "completed", "dueAt"];

class BadRequestError extends Error {}

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
    if (!title) throw new BadRequestError("A subtask with a due date needs a title");
    if (!hasDate) throw new BadRequestError("Subtask due date is required");

    filled.push({ ...pickSubtaskFields(slot), title });
  }

  if (filled.length === 0) {
    throw new BadRequestError("Fill at least one subtask with a title and a due date");
  }
  if (filled.length > MAX_SUBTASKS) {
    throw new BadRequestError(`A card can have at most ${MAX_SUBTASKS} subtasks`);
  }
  return filled;
}

function findOwnTodo(req) {
  if (!mongoose.isValidObjectId(req.params.id)) return null;
  return Todo.findOne({ _id: req.params.id, userId: req.user._id });
}

function todoNotFound(res) {
  return res.status(404).json({ message: "Todo not found" });
}

function handleError(res, error, action) {
  if (error instanceof BadRequestError) {
    return res.status(400).json({ message: error.message });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors)[0]?.message ?? "Invalid todo";
    return res.status(400).json({ message });
  }
  console.error(`Failed to ${action}:`, error);
  return res.status(500).json({ message: "Something went wrong, please try again" });
}

export async function listTodos(req, res) {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: 1 });
    return res.status(200).json(todos);
  } catch (error) {
    return handleError(res, error, "list todos");
  }
}

export async function createTodo(req, res) {
  try {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      throw new BadRequestError("Card title is required");
    }

    const todo = await Todo.create({
      userId: req.user._id,
      title: req.body.title,
      priority: req.body.priority,
      subtasks: filledSubtasksFromSlots(req.body.subtasks),
    });
    return res.status(201).json(todo);
  } catch (error) {
    return handleError(res, error, "create todo");
  }
}

// Card-level fields only; subtasks have their own routes below.
export async function updateTodo(req, res) {
  try {
    const todo = await findOwnTodo(req);
    if (!todo) return todoNotFound(res);

    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.priority !== undefined) todo.priority = req.body.priority;
    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return handleError(res, error, "update todo");
  }
}

export async function deleteTodo(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return todoNotFound(res);

    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return todoNotFound(res);
    return res.status(204).end();
  } catch (error) {
    return handleError(res, error, "delete todo");
  }
}

// Appends a new subtask (like Array#push), up to MAX_SUBTASKS per card.
export async function addSubtask(req, res) {
  try {
    const todo = await findOwnTodo(req);
    if (!todo) return todoNotFound(res);

    if (todo.subtasks.length >= MAX_SUBTASKS) {
      return res.status(400).json({ message: `A card can have at most ${MAX_SUBTASKS} subtasks` });
    }

    todo.subtasks.push(pickSubtaskFields(req.body));
    await todo.save();
    return res.status(201).json(todo);
  } catch (error) {
    return handleError(res, error, "add subtask");
  }
}

// Edits any field of one existing subtask, e.g. just its date. The schema
// rejects clearing its title or date.
export async function updateSubtask(req, res) {
  try {
    const todo = await findOwnTodo(req);
    if (!todo) return todoNotFound(res);

    const subtask = mongoose.isValidObjectId(req.params.subtaskId)
      ? todo.subtasks.id(req.params.subtaskId)
      : null;
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    subtask.set(pickSubtaskFields(req.body));
    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return handleError(res, error, "update subtask");
  }
}

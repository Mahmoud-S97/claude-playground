import mongoose from "mongoose";

const PRIORITIES = ["low", "medium", "high"];
export const MAX_SUBTASKS = 3;
const MAX_TITLE_LENGTH = 120;

// API responses use `id` instead of `_id` and never expose internals.
function toClientShape(doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  delete ret.userId;
  return ret;
}

// Only real subtasks are stored: empty slots in the UI never reach the DB.
const subtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Subtask title is required"],
      maxlength: MAX_TITLE_LENGTH,
    },
    priority: { type: String, enum: PRIORITIES, default: "medium" },
    completed: { type: Boolean, default: false },
    dueAt: { type: Date, required: [true, "Subtask due date is required"] },
  },
  { toJSON: { transform: toClientShape } },
);

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Card title is required"],
      maxlength: MAX_TITLE_LENGTH,
    },
    priority: { type: String, enum: PRIORITIES, default: "medium" },
    subtasks: {
      type: [subtaskSchema],
      validate: {
        validator: (subtasks) => subtasks.length >= 1 && subtasks.length <= MAX_SUBTASKS,
        message: `A card needs between 1 and ${MAX_SUBTASKS} subtasks`,
      },
    },
  },
  { timestamps: true, toJSON: { transform: toClientShape } },
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;

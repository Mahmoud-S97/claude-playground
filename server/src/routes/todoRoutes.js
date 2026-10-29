import { Router } from "express";
import {
  addSubtask,
  createTodo,
  deleteTodo,
  listTodos,
  updateSubtask,
  updateTodo,
} from "../controllers/todoController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// Every todo route needs a logged-in user; handlers only touch req.user's todos.
router.use(requireAuth);

router.route("/").get(listTodos).post(createTodo);
router.route("/:id").patch(updateTodo).delete(deleteTodo);

// Subtasks can be added and edited, but not deleted on their own.
router.post("/:id/subtasks", addSubtask);
router.patch("/:id/subtasks/:subtaskId", updateSubtask);

export default router;

import { request, sendJson } from './http'

// Mutations resolve to { code, message, todo }; delete to { code, message }.

export function listTodos() {
  return request('/api/todos')
}

export function createTodo({ title, priority, subtasks }) {
  return sendJson('/api/todos', 'POST', { title, priority, subtasks })
}

export function updateTodo(todoId, { title, priority }) {
  return sendJson(`/api/todos/${todoId}`, 'PATCH', { title, priority })
}

export function deleteTodo(todoId) {
  return request(`/api/todos/${todoId}`, { method: 'DELETE' })
}

export function addSubtask(todoId, subtask) {
  return sendJson(`/api/todos/${todoId}/subtasks`, 'POST', subtask)
}

export function updateSubtask(todoId, subtaskId, changes) {
  return sendJson(`/api/todos/${todoId}/subtasks/${subtaskId}`, 'PATCH', changes)
}

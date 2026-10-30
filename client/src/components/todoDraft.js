// The modal always shows MAX_SUBTASKS slots; the server stores only filled ones.
export const MAX_SUBTASKS = 3

// <input type="datetime-local"> works in local "YYYY-MM-DDTHH:mm"; the API in ISO.
export function toInputDateTime(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function toIsoDateTime(inputValue) {
  return inputValue ? new Date(inputValue).toISOString() : null
}

// Suggested when the user starts typing a title in an empty slot.
export function defaultDueInput() {
  const tomorrowMorning = new Date()
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1)
  tomorrowMorning.setHours(9, 0, 0, 0)
  return toInputDateTime(tomorrowMorning)
}

// An empty slot: no id (not on the server yet), no date until a title is typed.
function emptySlot() {
  return {
    key: crypto.randomUUID(),
    id: null,
    title: '',
    priority: 'medium',
    completed: false,
    dueAt: '',
    isDateSuggested: false,
  }
}

function withEmptySlots(slots) {
  return [...slots, ...Array.from({ length: MAX_SUBTASKS - slots.length }, emptySlot)]
}

export function createEmptyTodoDraft() {
  return {
    title: '',
    priority: 'medium',
    finished: false,
    initialFinished: false,
    subtasks: withEmptySlots([]),
  }
}

// Existing card -> form: its real subtasks first, then empty slots up to the max.
export function todoToDraft(todo) {
  const isFinished = todo.subtasks.every((task) => task.completed)
  return {
    title: todo.title,
    priority: todo.priority,
    finished: isFinished,
    initialFinished: isFinished,
    subtasks: withEmptySlots(
      todo.subtasks.map((task) => ({
        key: task.id,
        id: task.id,
        title: task.title,
        priority: task.priority,
        completed: task.completed,
        dueAt: toInputDateTime(task.dueAt),
        isDateSuggested: false,
      })),
    ),
  }
}

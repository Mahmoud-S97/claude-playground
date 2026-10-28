const SUBTASK_PRIORITIES = ['low', 'medium', 'high']

// Local "YYYY-MM-DDTHH:mm:00", the dueAt format the cards and modal use.
function toLocalDateTimeString(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

// Blank form for the "Add todo card" modal: 3 empty tasks, due tomorrow 09:00.
export function createEmptyTodoDraft() {
  const tomorrowMorning = new Date()
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1)
  tomorrowMorning.setHours(9, 0, 0, 0)
  const dueAt = toLocalDateTimeString(tomorrowMorning)

  return {
    title: '',
    priority: 'medium',
    finished: false,
    subtasks: SUBTASK_PRIORITIES.map((priority) => ({
      id: crypto.randomUUID(),
      title: '',
      priority,
      completed: false,
      dueAt,
    })),
  }
}

// Client-only id until cards are saved to the API.
export function draftToTodo(draft) {
  return {
    id: crypto.randomUUID(),
    title: draft.title,
    priority: draft.priority,
    subtasks: draft.subtasks.map((task) => ({ ...task, completed: draft.finished })),
  }
}

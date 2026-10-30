import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../api/http'
import * as todosApi from '../../api/todosApi'
import { toIsoDateTime } from '../../components/todoDraft'
import { useToast } from '../toast/useToast'

function sameTime(isoA, isoB) {
  return new Date(isoA).getTime() === new Date(isoB).getTime()
}

// Owns the signed-in user's cards. Every change goes to the API and the card is
// replaced with the server's copy. Success messages are toasted here; save and
// delete errors are thrown so the open modal can show them.
export function useTodos() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Kept as the error object so its text can be resolved at render time.
  const [loadFailure, setLoadFailure] = useState(null)
  const loadError = loadFailure && getErrorMessage(loadFailure, t)

  const replaceTodo = useCallback((updated) => {
    setTodos((current) => current.map((todo) => (todo.id === updated.id ? updated : todo)))
  }, [])

  const loadTodos = useCallback(async () => {
    setIsLoading(true)
    setLoadFailure(null)
    try {
      setTodos(await todosApi.listTodos())
    } catch (error) {
      setLoadFailure(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Inline (not loadTodos) so state updates happen only after the request.
    let ignore = false
    todosApi
      .listTodos()
      .then((list) => {
        if (!ignore) setTodos(list)
      })
      .catch((error) => {
        if (!ignore) setLoadFailure(error)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  // The server drops empty slots and rejects a slot with a date but no title.
  const createTodo = useCallback(
    async (draft) => {
      const { todo, message } = await todosApi.createTodo({
        title: draft.title,
        priority: draft.priority,
        subtasks: draft.subtasks.map((task) => ({
          title: task.title,
          priority: task.priority,
          dueAt: toIsoDateTime(task.dueAt),
          completed: draft.finished,
        })),
      })
      setTodos((current) => [...current, todo])
      showToast(message)
    },
    [showToast],
  )

  // Saves the modal for an existing card: card fields first, then each changed
  // subtask, then any newly filled slots. Each step updates the list, so if a
  // later step fails, what already saved is still shown.
  const saveTodo = useCallback(
    async (todo, draft) => {
      const cardResponse = await todosApi.updateTodo(todo.id, {
        title: draft.title,
        priority: draft.priority,
      })
      replaceTodo(cardResponse.todo)

      // The "Finished" switch only overrides subtasks if the user flipped it.
      const finishedChanged = draft.finished !== draft.initialFinished

      for (const slot of draft.subtasks.filter((task) => task.id)) {
        const original = todo.subtasks.find((task) => task.id === slot.id)
        const changes = {}
        if (slot.title.trim() !== original.title) changes.title = slot.title
        if (slot.priority !== original.priority) changes.priority = slot.priority
        if (!slot.dueAt || !sameTime(toIsoDateTime(slot.dueAt), original.dueAt)) {
          changes.dueAt = toIsoDateTime(slot.dueAt)
        }
        if (finishedChanged && original.completed !== draft.finished) changes.completed = draft.finished

        if (Object.keys(changes).length > 0) {
          const { todo: updated } = await todosApi.updateSubtask(todo.id, slot.id, changes)
          replaceTodo(updated)
        }
      }

      for (const slot of draft.subtasks.filter((task) => !task.id && (task.title.trim() || task.dueAt))) {
        const { todo: updated } = await todosApi.addSubtask(todo.id, {
          title: slot.title,
          priority: slot.priority,
          dueAt: toIsoDateTime(slot.dueAt),
          completed: finishedChanged ? draft.finished : false,
        })
        replaceTodo(updated)
      }

      showToast(cardResponse.message)
    },
    [replaceTodo, showToast],
  )

  const deleteTodo = useCallback(
    async (todoId) => {
      const { message } = await todosApi.deleteTodo(todoId)
      setTodos((current) => current.filter((todo) => todo.id !== todoId))
      showToast(message)
    },
    [showToast],
  )

  // Ticking a checkbox updates instantly and rolls back if the server refuses.
  const toggleSubtask = useCallback(
    async (todo, subtaskId) => {
      const subtask = todo.subtasks.find((task) => task.id === subtaskId)
      const completed = !subtask.completed
      replaceTodo({
        ...todo,
        subtasks: todo.subtasks.map((task) => (task.id === subtaskId ? { ...task, completed } : task)),
      })
      try {
        const { todo: updated } = await todosApi.updateSubtask(todo.id, subtaskId, { completed })
        replaceTodo(updated)
      } catch (error) {
        replaceTodo(todo)
        showToast(getErrorMessage(error, t), 'error')
      }
    },
    [replaceTodo, showToast, t],
  )

  return { todos, isLoading, loadError, loadTodos, createTodo, saveTodo, deleteTodo, toggleSubtask }
}

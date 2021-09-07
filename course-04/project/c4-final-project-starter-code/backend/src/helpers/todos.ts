import * as TodosAccess from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getTodoAttachmentUrl } from './attachmentUtils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
// import * as uuid from 'uuid'
// import * as createError from 'http-errors'

const logger = createLogger('todos')

// TODO: Implement businessLogic
export async function createTodo(userId: string, todoId: string, newTodo: CreateTodoRequest) {
  logger.info("executing business logic for create todo", {userId, todoId})
  const createdAt = new Date().toISOString();

  const newItem = {
    todoId,
    createdAt,
    userId,
    done: false,
    ...newTodo,
    attachmentUrl: getTodoAttachmentUrl(todoId)
  };

  await TodosAccess.createTodo(newItem)
  return newItem;
}

export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
  logger.info("executing business logic for update todo", {userId, todoId})
  const key = {userId: userId, todoId: todoId}

  await TodosAccess.updateTodo(key, updatedTodo)
}

export async function deleteTodo(userId: string, todoId: string) {
  logger.info("executing business logic for delete todo", {userId, todoId})
  const key = {userId: userId, todoId: todoId}

  await TodosAccess.deleteTodo(key)
}
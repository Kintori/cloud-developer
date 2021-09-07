import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('todosAcess')

// TODO: Implement the dataLayer logic
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;


export async function createTodo(newItem: TodoItem) {
  logger.info("Storing new todo item", newItem);
  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise();
  return newItem
}

export async function getTodosForUser(userId: string) {
  logger.info("Getting todos for user", {userId})
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise();

  return result.Items
}

export async function updateTodo(key: any, updatedTodo: TodoUpdate) {
  logger.info("Updating todo item", key)
  await docClient.update({
    TableName: todosTable,
    Key: key,
    UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues:{
        ":name":updatedTodo.name,
        ":dueDate":updatedTodo.dueDate,
        ":done": updatedTodo.done,
    },
    ExpressionAttributeNames:{
      "#name": "name"
    },
    ReturnValues:"UPDATED_NEW"
  }).promise();
}

export async function deleteTodo(key: any) {
  logger.info('Removing item with key', key)
  await docClient.delete({
      TableName: todosTable,
      Key: key
    }).promise();
}
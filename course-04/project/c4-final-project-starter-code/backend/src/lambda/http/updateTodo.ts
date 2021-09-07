import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLatencyMetric, createLogger, createSuccessMetric } from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = new Date().getTime();
    logger.info('updateTodo processing event: ', event);
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = typeof event.body === "object" ? event.body : JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateTodo(getUserId(event), todoId, updatedTodo);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("updateTodo", startTime, endTime)
    await createSuccessMetric("updateTodo")

    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )


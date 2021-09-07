import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLatencyMetric, createLogger, createSuccessMetric } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = new Date().getTime();

    logger.info('deleteTodo processing event: ', event);
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    await deleteTodo(getUserId(event), todoId)

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("deleteTodo", startTime, endTime)
    await createSuccessMetric("deleteTodo")

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



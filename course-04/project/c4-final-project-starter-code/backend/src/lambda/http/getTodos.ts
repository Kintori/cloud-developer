import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todosAcess'
import { getUserId } from '../utils';
import { createLatencyMetric, createLogger, createSuccessMetric } from '../../utils/logger'

const logger = createLogger('getTodos')

// X TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = new Date().getTime();
    // Write your code here
    logger.info('getTodos caller event', event);

    const todos = await getTodosForUser(getUserId(event));

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("getTodos", startTime, endTime)
    await createSuccessMetric("getTodos")

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: todos
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)



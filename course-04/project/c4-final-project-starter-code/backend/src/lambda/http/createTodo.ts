import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as uuid from 'uuid'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLatencyMetric, createSuccessMetric, createLogger  } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = new Date().getTime();

    logger.info('createTodo processing event: ', event);
    const todoId = uuid.v4();
    const newTodo: CreateTodoRequest = typeof event.body === "object" ? event.body : JSON.parse(event.body)
    // X TODO: Implement creating a new TODO item
    const newItem = await createTodo(getUserId(event), todoId, newTodo)

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("createTodo", startTime, endTime)
    await createSuccessMetric("createTodo")

    return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
  })

handler.use(
  cors({
    credentials: true
  })
)



import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/attachmentUtils'
import { createLatencyMetric, createLogger, createSuccessMetric } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = new Date().getTime();

    logger.info('generateUploadUrl processing event: ', event);
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const url = createAttachmentPresignedUrl(todoId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("generateUploadUrl", startTime, endTime)
    await createSuccessMetric("generateUploadUrl")

    return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
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



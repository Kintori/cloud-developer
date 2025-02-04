import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
//
// const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export function createAttachmentPresignedUrl(todoId: string) {
  var urlExpirationNum: number = +urlExpiration;
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpirationNum
  })
}

export function getTodoAttachmentUrl(todoId: string) {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}
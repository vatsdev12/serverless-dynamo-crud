'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
})
AWS.config.region = 'eu-central-1'

const sns = new AWS.SNS()

const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  const createEndPonintsParams = {
    PlatformApplicationArn:
      process.env.PLATFORM_APPLICATION_ARN,
    Token:
      data.deviceToken
  }

  sns
    .createPlatformEndpoint(createEndPonintsParams)
    .promise()
    .then(function (result) {
      const params = {
        TableName: process.env.USER_TABLE,
        Item: {
          id: uuid.v1(),
          userId: data.userId,
          deviceToken: data.deviceToken,
          deviceType: data.deviceType,
          EndpointArn: result.EndpointArn,
          createdAt: timestamp,
          updatedAt: timestamp
        }
      }

      dynamoDb.put(params, error => {
        // handle potential errors
        if (error) {
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: "Couldn't create the todo item."
          })
          return
        }

        // create a response
        const response = {
          statusCode: 200,
          body: JSON.stringify(params.Item)
        }
        callback(null, response)
      })

    })
    .catch(function(error){
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "error While generate Target Arn"
      })
      return
    })
}

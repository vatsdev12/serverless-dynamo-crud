'use strict'

const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports.list = (event, context, callback) => {

  let params = {
    TableName: process.env.NOTIFICATION_TEMPLATE_TABLE,
    Limit: 1
  };

  if (event.pathParameters.LastEvaluatedKey !== 'null') {
    params = {
      ...params,
      ExclusiveStartKey:{
        notificationName:event.pathParameters.LastEvaluatedKey
      }
    }
  }

  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error('erororor', error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't create the todo item."
      })
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
    callback(null, response)
  })
}

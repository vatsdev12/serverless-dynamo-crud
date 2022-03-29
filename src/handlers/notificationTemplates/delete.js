'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports.delete = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  const params = {
    TableName: process.env.NOTIFICATION_TEMPLATE_TABLE,
    Key: {
        notificationName: event.pathParameters.notificationName,
    }
  };

  dynamoDb.delete(params, (error, result) => {
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

'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  const params = {
    TableName: process.env.NOTIFICATION_TEMPLATE_TABLE,
    Key: {
        notificationName: event.pathParameters.notificationName,
    },
    ExpressionAttributeNames: {
      '#title': 'title',
    },
    ExpressionAttributeValues: {
      ':title': data.title,
      ':image': data.image,
      ':message': data.message,
      ':body': data.body,
      ':composed': data.composed,
      ':badge': data.badge,
      ':priority': data.priority,
      ':sound': data.sound
    },
    UpdateExpression: 'SET #title = :title, image = :image, message = :message, body = :body, composed = :composed,badge = :badge, priority = :priority,sound = :sound',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
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

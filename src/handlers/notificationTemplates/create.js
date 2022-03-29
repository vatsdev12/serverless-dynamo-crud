'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  const params = {
    TableName: process.env.NOTIFICATION_TEMPLATE_TABLE,
    Item: {
      notificationName: data.notificationName,
      title: data.title,
      image: data.image,
      message: data.message,
      body: data.body,
      composed: data.composed,
      badge: data.badge,
      priority: data.priority,
      sound: data.sound,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  // write the todo to the database
  dynamoDb.put(params, error => {
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

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}

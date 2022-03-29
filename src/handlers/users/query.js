'use strict'

const AWS = require('aws-sdk')
const sendNotification = require('../../lib/fcm-notification')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.query = (event, context, callback) => {
  const params = {
    TableName: process.env.USER_TABLE,
    IndexName: 'userId-index',
    KeyConditionExpression: '#userId = :v_userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':v_userId': event.pathParameters.userId
    }
  }

  dynamoDb.query(params, async (error, result) => {
    if (error) {
      console.error('error', error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't fetch the todo item."
      })
      return
    }
    let response={}
    try {
      await sendNotification.sendNotification({ data: result })
      response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } catch (error) {
      response = {
        statusCode: 501,
        body: "Error coming while send notification"
      }
    }
     
    callback(null, response)
  })
}

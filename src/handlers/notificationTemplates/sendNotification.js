'use strict'

const AWS = require('aws-sdk')
const sendNotification = require('../../lib/fcm-notification')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.send = (event, context, callback) => {
  const data = JSON.parse(event.body)

  const userTableparams = {
    TableName: process.env.USER_TABLE,
    IndexName: 'userId-index',
    KeyConditionExpression: '#userId = :v_userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':v_userId': data.userId
    }
  }

  const notificationTemplateTableparams = {
    TableName: process.env.NOTIFICATION_TEMPLATE_TABLE,
    Key: {
      notificationName: data.notificationName
    }
  }

  let fetchUserData = dynamoDb.query(userTableparams).promise()
  let fetchNotificationTemplate = dynamoDb
    .get(notificationTemplateTableparams)
    .promise()

  Promise.all([fetchUserData, fetchNotificationTemplate]).then(async function (
    result
  ) {
    try {
      await sendNotification.sendNotification({
        data: result[0],
        notificationData: result[1].Item
      })
      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      callback(null, response)
    } catch (error) {
      console.log('errorrr', error)
      const response = {
        statusCode: 200,
        body: 'Error while send notification'
      }
      callback(null, response)
    }
  })
}

'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: "ap-southeast-2" });
exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({ apiversion: "2012-08-10" });
    const documentclient = new AWS.DynamoDB.DocumentClient({ region: "ap-southeast-2" });

    let responseBody = "";
    let statusCode = 0;

    const { id } = event.pathParameters;

    const params = {
        TableName: "User",
        Key: {
            id: id
        }
    }

    try {
        const data = await documentclient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    } catch (error) {
        responseBody = 'Unable to get user data';
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "test reports"
        },
        body: responseBody
    }

    return response;
}
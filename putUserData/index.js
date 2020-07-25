'use strict'
const AWS = require('aws-sdk');

AWS.config.update({region: "ap-southeast-2"});
exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({apiversion: "2012-08-10"});
    const documentclient = new AWS.DynamoDB.DocumentClient({region: "ap-southeast-2"});

    let responseBody = "";
    let statusCode = 0;

    const {id, firstname, lastname} = JSON.parse(event.body);

    const params = {
        TableName: "Users",
        Item: {
            id: id,
            firstname: firstname,
            lastname: lastname
        }
    }

    try {
        const data = await documentclient.put(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 201;
    } catch (error) {
        responseBody = 'Unable to put user data';
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
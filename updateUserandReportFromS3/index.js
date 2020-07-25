const AWS = require('aws-sdk');
const nodemailer = require("nodemailer");

const ses = new AWS.SES();

const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event) => {

    let statusCode = 0;
    let responseBody = '';

    const { name } = event.Records[0].s3.bucket;

    const { key } = event.Records[0].s3.object;

    try {
        await putLabTestReport(event, key);
        await sendEmail(event, name, key);


        responseBody = 'Succeeded adding the laboratory report to the DynamoDB and updating the customer via email';

        statusCode = 201;



    } catch (err) {

        responseBody = 'adding the laboratory report to the DynamoDB and updating the customer via email';

        statusCode = 403;

    }



    const response = {

        statusCode: statusCode,

        body: responseBody

    };



    return response;

};

const sendEmail = async function (event, name, key) {

    //get user's NIC
    const data = await s3.getObject(params).promise();
    const filepath = key.split('/');
    const nic = filepath[0];

    //get user's details using NIC
    const userparams = {
        TableName: "User",
        Key: {
            id: nic
        }
    }

    const data = await documentclient.get(userparams).promise();
    const userData = JSON.stringify(data.Item);

    //assign user's email address to a variable
    const email = userData.email;


    const mailOptions = {

        from: <senderemail>,

        subject: "XYZ: Your Lab Test Report - NIC No: " + nic + " !",

        html: `

                Dear Customer, 

                Now you can make an appoint to meet your GP. Please find attached laboratory test report. 

                Thank You!

            `,

        to: email,

        attachments: [

            {

                filename: key,

                content: data.Body

            }

        ]

        // bcc: Any BCC address you want here in an array,

    };

    // create Nodemailer SES transporter

    var transporter = nodemailer.createTransport({

        SES: ses

    });

    // send email

    await transporter.sendMail(mailOptions);
}

const putLabTestReport = async function (event, key) {
    const filepath = key.split('/');
    console.log('filepath::: $(filepath)');
    const nic = filepath[0];
    console.log('nic::: $(nic)');
    const filename = filepath[1];
    console.log('file::: $(filename)');


    const putParams = {

        TableName: "Report",

        //put NIC as hash key and filename as range key into Report DynamoDB table
        Item: {

            nic: nic,

            filename: filename

        }

    };

    await documentClient.put(putParams).promise();
}
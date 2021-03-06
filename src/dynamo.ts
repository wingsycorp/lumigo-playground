/* eslint-disable @typescript-eslint/no-var-requires */
import { APIGatewayProxyHandler } from 'aws-lambda';
import uuid = require('uuid');
import { DynamoDB } from 'aws-sdk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lumigo = require('@lumigo/node-tracer')({
    token: process.env.LUMIGO_TOKEN
});
const moment = require('moment');


const dynamoDbDocumentClient = new DynamoDB.DocumentClient();

const dynamo: APIGatewayProxyHandler = async function() {
    console.log('Running dynamo')
    const id = uuid.v4();
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const item = {
        id,
        time
    };

    const params: any = {
        TableName: process.env.DYNAMODB_LUMIGO_TABLE,
        Item: item,
    };
    await dynamoDbDocumentClient.put(params).promise();
    return {
        statusCode: 200,
        body: JSON.stringify(item)
    };
}

export const handler = lumigo.trace(dynamo);
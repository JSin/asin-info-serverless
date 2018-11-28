import * as AWS from 'aws-sdk';
import { asinTableName } from '../constants/config';

const dynamodb = new AWS.DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
});

const params = {
  TableName: asinTableName,
  KeySchema: [
    { AttributeName: 'asin', KeyType: 'HASH' }, // Partition key
  ],
  AttributeDefinitions: [{ AttributeName: 'asin', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});

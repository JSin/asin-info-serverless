import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';
import jsdom from 'jsdom'; // new jsdom type definitions don't exist so using Javascript
import * as AWS from 'aws-sdk';
import { AsinRequest, PutItemAsinInformation } from './constants/interfaces';
import { asinTableName } from './constants/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
});

export const asinInfo: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context) => {
  const response404 = (message: string) => ({
    statusCode: 404,
    body: JSON.stringify({ errorMessage: message }),
  });
  const responseData = {
    productDimensions: '',
    rank: '',
  };

  if (!event.body) {
    return response404('Expected parameter asin');
  }
  const postMessage: AsinRequest = JSON.parse(event.body);
  if (!postMessage.asin || postMessage.asin.length !== 10) {
    return response404('Invalid ASIN');
  }

  let htmlResponse;
  try {
    htmlResponse = await axios.get('https://www.amazon.com/dp/' + postMessage.asin);
  } catch (e) {
    return response404('Invalid ASIN, Amazon is down or ignoring your requests.');
  }

  try {
    const dom = new jsdom.JSDOM(htmlResponse.data, { virtualConsole: new jsdom.VirtualConsole() });
    const tableHeaders = dom.window.document.querySelectorAll('#productDetails_detailBullets_sections1 th');
    for (const tableHeader of tableHeaders) {
      const headerText = tableHeader.textContent ? tableHeader.textContent.trim() : '';
      switch (headerText) {
        case 'Product Dimensions':
          responseData.productDimensions = tableHeader.nextElementSibling.textContent.trim();
          break;
        case 'Best Sellers Rank':
          responseData.rank = tableHeader.nextElementSibling.textContent.trim();
          break;
      }
    }
  } catch (e) {
    return response404('Unable to parse data');
  }

  const inputParams: PutItemAsinInformation = {
    TableName: asinTableName,
    Item: {
      asin: postMessage.asin,
      productDimensions: responseData.productDimensions,
      rank: responseData.rank,
    },
  };
  dynamoDb.put(inputParams, (err, data) => {
    if (err) {
      console.error('TODO: Add error logging');
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(responseData),
  };
};

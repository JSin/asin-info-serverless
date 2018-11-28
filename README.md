# Serverless retrieve basic data from Amazon API. (Technical Assessment)

## Requirements
* NodeJS = 8.10.0
* AWS credentials (DynamoDB connection requires keys to be setup)

### Setup

```sh
# Install node_modules
$ npm install

# Turn on DynamoDB
$ docker run -p 8000:8000 amazon/dynamodb-local

# Set up database (only need to run this the first time)
$ npm run setup-tables

# Run Lambda locally
$ npx serverless offline start
```

## Assumptions and Considerations
* I would reconsider using up-to-date data because of the request latency and the cost associated to that in lambda functions. Below are possible redesigns:
  * One way to redesign this would be to have lambda take a long time for a new ASIN but any existing ones would push the ASIN onto a message queue to be parsed later. This could lead to less searched products being out of date.
  * You could crawl Amazon with background processes.
  * Another way would be to parse the data on the client if the data is not needed elsewhere (no server needed but potentially slow lookups).
  * Using a server or even lambda is a bad idea without background processes because as you scale the 2 second response per request really adds up in server costs.
* This solution naturally scales as AWS scales out Lambda and DynamoDB.
* Originally I buit the lambda function in golang and tested on AWS but serverless-offline doesn't exist for golang.
  * Debated on using localstack with Go but decided just to rewrite in nodejs.

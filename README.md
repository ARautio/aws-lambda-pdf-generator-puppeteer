# AWS lambda PDF generator example

The purpose of this repository is to demonstrate a PDF generator inside
AWS lambda with [chrome-aws-lambda](https://www.npmjs.com/package/chrome-aws-lambda), [serverless](https://serverless.com/), [pug](https://pugjs.org/) and [knex](https://knexjs.org/). This has been done as part of the article in dev.to

# Setup

1. Initialize serverless either inside project or globally (after installing package globally) with

```
serverless
```

2. Modify PUG template inside src/
3. Fetch data for the template. In this repository we use knex and postgresSQL. For production use I would suggest to add database username and password to environmental variables either inside deployment platform or in AWS.
4. Deploy with

```
npm run deploy:dev
```

## Usage

Deploying this to AWS will generate you an url like https://xxxx.execute-api.*area*.amazonaws.com/development/pdf/{yearMonth} in development and https://xxxx.execute-api.*area*.amazonaws.com/production/pdf/{yearMonth} in production.

When running this setup with 1024 MB memory, it takes rougly 4 seconds to execute. With more complex pages or data fetching default timeout may not be enough so you may need to increase the timeout either with [serverless.yaml](https://www.serverless.com/framework/docs/providers/aws/guide/functions/) or straight from AWS console.

Puppeteer is pretty versatile so you can create PDF from your own html file like in this example with PUG template language or calling URL.

More information regarding this repository can found from ( Generate a PDF in AWS Lambda with NodeJS and Puppeteer)[https://dev.to/akirautio/generate-a-pdf-in-aws-lambda-with-nodejs-and-puppeteer-2b93] dev.to post.

## Security

Since this deployment setup exposes your PDF generator straight to open internet, because it can be called without any restrictions. Depending on your solution this may also cause an issue since the content of your PDF is exposed outside if correct parameters are given.

To mitigate this issue there are several ways to increase the security and reduce / block the abuse:

1. Enabling API key to API Gateway to limit an access and meter the usage. Serverless has [API key plugin](https://www.serverless.com/plugins/serverless-add-api-key) for this purpose.

2. Enable authorizer to API Gateway (either AWS_IAM or your own).

- https://www.serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-aws_iam-authorizers
- https://www.serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers

3. Checking authorization before starting up puppeteer.

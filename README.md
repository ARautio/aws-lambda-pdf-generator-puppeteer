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

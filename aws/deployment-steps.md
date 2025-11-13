# AWS Deployment Steps

## 1. Create DynamoDB Table
```bash
aws dynamodb create-table --cli-input-json file://dynamodb-table.json
```

## 2. Create IAM Role for Lambda
```bash
aws iam create-role --role-name QuizLambdaRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

aws iam attach-role-policy --role-name QuizLambdaRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam put-role-policy --role-name QuizLambdaRole --policy-name DynamoDBAccess --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/QuizSections"
    }
  ]
}'
```

## 3. Deploy Lambda Functions
```bash
# Package and deploy addSection function
zip -r add-section.zip lambda-add-section.js node_modules/
aws lambda create-function \
  --function-name addSection \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/QuizLambdaRole \
  --handler lambda-add-section.handler \
  --zip-file fileb://add-section.zip

# Package and deploy getSections function
zip -r get-sections.zip lambda-get-sections.js
aws lambda create-function \
  --function-name getSections \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/QuizLambdaRole \
  --handler lambda-get-sections.handler \
  --zip-file fileb://get-sections.zip

# Package and deploy getQuestions function
zip -r get-questions.zip lambda-get-questions.js
aws lambda create-function \
  --function-name getQuestions \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/QuizLambdaRole \
  --handler lambda-get-questions.handler \
  --zip-file fileb://get-questions.zip
```

## 4. Create API Gateway
```bash
# Create REST API
aws apigateway create-rest-api --name QuizMasterAPI

# Import API definition (update api-gateway-swagger.json with your ARNs first)
aws apigateway put-rest-api --rest-api-id YOUR_API_ID --body file://api-gateway-swagger.json

# Deploy API
aws apigateway create-deployment --rest-api-id YOUR_API_ID --stage-name dev
```

## 5. Update Frontend API URLs
Update `src/utils/api.js` with your API Gateway URL:
```javascript
const API_BASE_URL = "https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/dev";
```

## Required Dependencies for Lambda
Create package.json in aws folder:
```json
{
  "dependencies": {
    "uuid": "^9.0.0"
  }
}
```

Run: `npm install` in aws folder before packaging Lambda functions.
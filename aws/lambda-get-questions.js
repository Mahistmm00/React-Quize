const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'QuizSections';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    try {
        const sectionId = event.pathParameters?.sectionId;
        
        if (!sectionId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Section ID is required' 
                })
            };
        }

        // Get section with questions
        const result = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: { sectionId }
        }).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    error: 'Section not found' 
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                questions: result.Item.questions,
                sectionInfo: {
                    sectionId: result.Item.sectionId,
                    title: result.Item.title,
                    description: result.Item.description,
                    questionCount: result.Item.questionCount,
                    totalPoints: result.Item.totalPoints
                }
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};
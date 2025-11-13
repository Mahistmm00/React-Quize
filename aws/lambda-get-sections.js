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
        // Scan all sections (for small datasets)
        const result = await dynamodb.scan({
            TableName: TABLE_NAME,
            ProjectionExpression: 'sectionId, title, description, questionCount, totalPoints, createdAt'
        }).promise();

        // Sort by creation date (newest first)
        const sections = result.Items.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                sections,
                count: sections.length
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
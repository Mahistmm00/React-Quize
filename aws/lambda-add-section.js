const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'QuizSections';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    try {
        const { title, description, questions } = JSON.parse(event.body);
        
        // Validate input
        if (!title || !description || !questions || !Array.isArray(questions)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required fields: title, description, questions' 
                })
            };
        }

        // Calculate totals
        const questionCount = questions.length;
        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

        // Create section object
        const sectionId = uuidv4();
        const section = {
            sectionId,
            title,
            description,
            questions,
            questionCount,
            totalPoints,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to DynamoDB
        await dynamodb.put({
            TableName: TABLE_NAME,
            Item: section
        }).promise();

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Section created successfully',
                sectionId,
                section
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
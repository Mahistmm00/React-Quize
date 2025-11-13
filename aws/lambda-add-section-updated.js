import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "QuizeSections";

export const handler = async (event) => {
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

  console.log("Received event:", JSON.stringify(event, null, 2));
  
  try {
    let requestData;
    
    // Handle API Gateway event (has event.body)
    if (event.body) {
      requestData = JSON.parse(event.body);
    } 
    // Handle direct Lambda test event (data is directly in event)
    else if (event.title || event.description || event.questions) {
      requestData = event;
    } 
    else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No valid request data found" })
      };
    }

    const { title, description, questions } = requestData;

    if (!title || !description || !questions || !Array.isArray(questions)) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: "Missing required fields" }) 
      };
    }

    const sectionId = crypto.randomUUID();
    const questionCount = questions.length;
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

    const section = {
      sectionId,
      title,
      description,
      questions,
      questionCount,
      totalPoints,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: section }));

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: "Section created successfully", sectionId, section }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: error.message }),
    };
  }
};
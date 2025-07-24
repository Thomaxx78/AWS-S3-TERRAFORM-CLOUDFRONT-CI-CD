const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const REGION = "eu-west-3";
const TABLE_NAME = "todos";

const client = new DynamoDBClient({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(client);

app.get("/todos", async (req, res) => {
  try {
    const data = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(data.Items);
  } catch (err) {
    console.error("Erreur backend GET /todos:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  const { id, text } = req.body;
  try {
    if (!id || !text) {
      throw new Error("id and text are required");
    }
    await dynamo.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { id, text },
      })
    );
    res.json({ message: "Task added" });
  } catch (err) {
    console.error("Erreur backend POST /todos:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("API is running on http://localhost:3000");
});

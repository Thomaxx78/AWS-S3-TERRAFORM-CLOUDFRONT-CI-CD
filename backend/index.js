const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

AWS.config.update({ region: "eu-west-3" });
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "todos";

// GET all tasks
app.get("/todos", async (req, res) => {
  try {
    const data = await dynamo.scan({ TableName: TABLE_NAME }).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new task
app.post("/todos", async (req, res) => {
  const { id, text } = req.body;
  try {
    await dynamo
      .put({ TableName: TABLE_NAME, Item: { id, text } })
      .promise();
    res.json({ message: "Task added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete("/todos/:id", async (req, res) => {
  try {
    await dynamo
      .delete({ TableName: TABLE_NAME, Key: { id: req.params.id } })
      .promise();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("API is running on http://localhost:3000");
});

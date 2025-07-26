import express from "express";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getAWSCredentials } from "./secrets.js";

const app = express();
app.use(cors());
app.use(express.json());

let docClient;

(async () => {
  try {
    // Récupère les creds de Secrets Manager
    const creds = await getAWSCredentials();

    // Configure DynamoDBClient avec ces creds
    const client = new DynamoDBClient({
      region: creds.region,
      credentials: {
        accessKeyId: creds.accessKeyId,
        secretAccessKey: creds.secretAccessKey,
      },
    });

    // Initialise le client DynamoDBDocumentClient
    docClient = DynamoDBDocumentClient.from(client);

    console.log("✅ DynamoDB connecté avec credentials depuis Secrets Manager");

    // Démarre le serveur
    app.listen(3000, () => {
      console.log("✅ API is running on http://localhost:3000");
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'initialisation des credentials :", err);
  }
})();

app.get("/todos", async (req, res) => {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: "todos" }));
    res.json(data.Items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
  }
});

app.post("/todos", async (req, res) => {
  const { id, text } = req.body;

  if (!id || !text) {
    return res.status(400).json({ error: "Champs id et text requis" });
  }

  try {
    await docClient.send(
      new PutCommand({
        TableName: "todos",
        Item: { id, text },
      })
    );
    res.status(201).json({ message: "Tâche ajoutée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la tâche" });
  }
});

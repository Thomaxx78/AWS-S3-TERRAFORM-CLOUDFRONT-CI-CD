// secrets.js
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "eu-west-3" });

export async function getAWSCredentials() {
  try {
    const command = new GetSecretValueCommand({ SecretId: "prod/myapp/aws" });
    const data = await client.send(command);

    if ("SecretString" in data) {
      const secret = JSON.parse(data.SecretString);
      return secret;
    } else {
      throw new Error("Secret binary not supported");
    }
  } catch (error) {
    console.error("Erreur récupération secret :", error);
    throw error;
  }
}

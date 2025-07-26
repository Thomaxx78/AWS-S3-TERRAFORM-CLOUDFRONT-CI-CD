import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function getAWSCredentials() {
  const client = new SecretsManagerClient({ region: "eu-west-3" });

  const command = new GetSecretValueCommand({
    SecretId: "prod/myapp/aws",
  });

  const response = await client.send(command);
  const secret = JSON.parse(response.SecretString);

  return {
    accessKeyId: secret.accessKeyId,
    secretAccessKey: secret.secretAccessKey,
    region: secret.region,
  };
}

# 📝 AWS Todo App – Fullstack Infrastructure avec Terraform, Node.js, Docker & CI/CD

Ce projet est une application **Todo List** déployée sur AWS, utilisant :

* Un **backend Node.js/Express** pour gérer les endpoints.
* Une **base de données DynamoDB**.
* Une infrastructure complète provisionnée avec **Terraform**.
* Un déploiement frontend (S3 + CloudFront) et backend (EC2 + PM2).
* Une gestion des secrets via **AWS Secrets Manager**.
* Un pipeline **CI/CD avec GitHub Actions**.
* Un container Docker pour le backend en local.

---

## 🌐 Fonctionnalités

* Ajouter, lister et supprimer des Todos.
* Données stockées dans DynamoDB.
* Serveur backend maintenu actif via PM2 sur EC2.
* CI/CD automatique avec GitHub Actions.
* Infrastructure totalement décrite avec Terraform (infra as code).

---

## 🛠️ Stack Technique

| Composant            | Technologie              |
| -------------------- | ------------------------ |
| Backend              | Node.js + Express        |
| Base de données      | DynamoDB                 |
| Infrastructure       | Terraform                |
| CI/CD                | GitHub Actions           |
| Serveur              | EC2 t2.micro (Free Tier) |
| Orchestration        | PM2                      |
| Secrets              | AWS Secrets Manager      |
| Frontend (optionnel) | S3 + CloudFront          |
| Docker local         | Dockerfile pour backend  |

---

## ✨ Déploiement

### 1. Cloner le repo

```bash
git clone https://github.com/ton-repo/AWS-S3-TERRAFORM-CLOUDFRONT-CI-CD.git
cd AWS-S3-TERRAFORM-CLOUDFRONT-CI-CD
```

### 2. Infrastructure avec Terraform

Initialisation :

```bash
cd terraform
terraform init
terraform apply
```

Cela va créer :

* une instance EC2
* une table DynamoDB nommée `todos`
* un bucket S3 pour le frontend
* CloudFront
* IAM, VPC, SG...

---

### 3. Backend Node.js

#### A. Configuration

* Les credentials AWS sont récupérés via IAM role attaché à EC2.
* Secrets (ex: access à DynamoDB si nécessaire) sont stockés dans Secrets Manager.

#### B. Démarrage manuel sur EC2

SSH dans l’instance EC2 :

```bash
ssh -i "cle.pem" ec2-user@<IP_EC2>
```

Installation Node.js + PM2 :

```bash
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git
sudo npm install -g pm2
```

Lancer l’app :

```bash
cd AWS-S3-TERRAFORM-CLOUDFRONT-CI-CD/backend
npm install
pm run start
pm2 start index.js --name "backend"
```

L’app tourne sur le port 3000 (`http://<IP_EC2>:3000/todos`).

---

### 4. CI/CD

Un pipeline GitHub Actions automatise :

* Le build du projet.
* Le push vers S3 (frontend).
* Le déploiement backend si modifié.

Fichier `.github/workflows/deploy.yml` gère ce processus.

---

## 📦 Docker (pour tests locaux)

```bash
cd backend
docker build -t todo-backend .
docker run -p 3000:3000 todo-backend
```

---

## 📡 API

* `GET /todos` — récupère tous les todos.
* `POST /todos` — ajoute un todo `{ id: string, text: string }`.
* `DELETE /todos/:id` — supprime un todo.

---

## 💰 Coût et précautions

* L’instance EC2 `t2.micro` est **gratuite jusqu’à 750 heures par mois** (Free Tier).
* DynamoDB est aussi gratuite en lecture/écriture jusqu'à 25 Go et 200M requêtes/mois (Free Tier).
* Secrets Manager est payant **par secret stocké** (0,40\$/mois/secret), mais peut rester gratuit si très limité.
* S3 + CloudFront peuvent générer des coûts faibles selon le trafic.

### Astuces :

* Pour éviter les **mauvaises surprises** :

  * Active la **facturation AWS** et les **alertes budgétaires**.
  * Supprime ou arrête l’EC2 manuellement (`sudo shutdown -h now`) une fois le projet validé.
  * Tu peux ajouter une carte bancaire virtuelle à 0€, mais il est préférable d’activer les alertes.

---

## ✅ Sécurité

* Utilisation d’IAM role pour éviter les credentials en dur.
* Secrets sensibles stockés dans AWS Secrets Manager.
* Aucun port autre que 22 et 3000 exposé sur EC2.

---

## 📚 Pour aller plus loin

* Convertir le backend en **Lambda** pour un hébergement serverless (plus économe).
* Ajouter l’authentification avec Amazon Cognito.
* Mettre en place une API Gateway pour sécuriser les endpoints.
* Ajouter des tests unitaires et d’intégration.

---

## 👨‍💼 Auteur

Projet réalisé dans le cadre d’un cours avec déploiement cloud complet.
Encadré par : professeur IIM, évaluation prévue sur EC2 actif.

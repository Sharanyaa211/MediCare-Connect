MediCare Connect - Full Stack MERN Application

MediCare Connect is a full-stack MERN (MongoDB, Express, React, Node.js) healthcare management platform designed to streamline patient appointments, medical records, and user management.

📂 Project Structure

medicare-connect/backend/ - Node.js & Express API server

medicare-connect/frontend/ - React & Vite client interface

docker-compose.yml - Multi-container Docker orchestration file

Jenkinsfile - Jenkins Continuous Integration (CI) pipeline configuration

1. How to Set Up the Project

Clone the Repository:

git clone https://github.com/Sharanyaa211/MediCare-Connect.git
cd MediCare_Connect_Full_Project1


Configure Environment Variables:

Navigate to medicare-connect/backend/ and ensure your .env file is configured with your database URI and JWT secrets.

2. How to Build and Run the Application

You can run this application either locally using Node.js or via Docker containers.

Option A: Run via Docker Compose (Recommended)

From the root directory of the project, run:

docker compose up --build -d


This will automatically build and spin up both the backend and frontend containers.

Access the frontend via http://localhost and the backend API via http://localhost:5000.

Option B: Run Locally (Without Docker)

Run the Backend:

cd medicare-connect/backend
npm install
npm run dev


Run the Frontend (in a separate terminal):

cd medicare-connect/frontend
npm install
npm run dev


3. CI/CD Pipeline (Jenkins)

This project features an automated CI/CD pipeline defined in the Jenkinsfile. It consists of the following three stages:

Checkout Stage:

Automatically fetches and pulls the latest version of the source code directly from your GitHub repository (main branch) into the Jenkins workspace.

Build Stage:

Prepares both the backend and frontend modules by installing all required dependencies (npm install) and building the production-ready React bundle (npm run build).

Deploy Stage:

Triggers Docker Compose (docker compose up -d --build) to locally build and deploy the containerized application services seamlessly.
# ClasInfoPro

## Overview

This repository contains the initial setup for **ClasInfoPro**, a full-stack web application.

* **Backend:** Sails.js (Node.js MVC framework)
* **Frontend:** Vue 3 with PrimeVue UI components and VueUse composables
* **Database:** Microsoft SQL Server

The objective of this repository is to establish a clean, scalable, and maintainable foundation following industry best practices. This setup is intended to support future feature development with minimal refactoring.

---

## Authentication (Passkey Support)

ClasInfoPro supports secure **Passkey Login (WebAuthn / FIDO2)** in addition to standard username/password authentication.
This enables passwordless login using device biometrics (Face ID, Fingerprint, Windows Hello) for improved security and user experience.

---

## Tech Stack

### Backend

* Node.js
* Sails.js
* RESTful API architecture
* Microsoft SQL Server

### Frontend

* Vue 3
* PrimeVue
* VueUse
* Vite

---

## Project Structure

```
root/
├── backend/        # Sails.js application
├── frontend/       # Vue 3 application
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Prerequisites

Ensure the following tools are installed on your system:

* Node.js (LTS version recommended)
* npm or yarn
* Git
* Docker & Docker Compose
* Microsoft SQL Server (local or remote)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

### 2. Backend Setup (Sails.js)

```bash
cd backend
npm install
```

Create a local environment file using the provided example:

```bash
cp .env.example .env
```

Start the backend server:

```bash
npm run dev
```

The backend service will start on the configured port.

---

### 3. Frontend Setup (Vue 3)

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start in development mode.

---

## 🐳 Docker Setup

You can run the complete project (Frontend + Backend + Database) using Docker.

---

### 1. Run Project with Docker

```bash
docker compose down
docker compose up --build
```

---

### 2. Access Services

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:1337 |
| Database | localhost:1433        |

---

### 3. Environment Configuration

#### Frontend

Create:

```
frontend/.env.development
```

Add:

```
VITE_API_BASE_URL=/api/v1
VITE_PROXY_TARGET=http://localhost:1337
```

---

#### Docker Note

Inside Docker, backend is accessed using:

```
http://backend:1337
```

---

### 4. How It Works

```
Browser
  ↓
Frontend (5173)
  ↓
/api/v1 (proxy)
  ↓
Backend (backend:1337)
  ↓
MS SQL (1433)
```

---

### 5. Useful Docker Commands

```bash
docker ps
docker compose down
docker compose up --build
```

---

### 6. Common Issues

#### Port already in use

```bash
kill-port 5173
```

#### Backend not reachable

* Ensure backend container is running
* Check proxy configuration

#### Database connection issue

* Wait for MSSQL to start
* Verify credentials

---

## Environment Variables

Sensitive configuration values are intentionally excluded from version control.

Please refer to:

* `.env.example` (backend)

and create your local `.env` file accordingly.

---

## Development Notes

* This repository currently contains only the **initial project scaffold**.
* No business logic or production features are implemented at this stage.
* All future development should build upon this foundation while adhering to agreed-upon branching and commit conventions.

---

## Git & Commit Guidelines

* Use clear and descriptive commit messages
* Keep commits small and purpose-driven
* Do not commit secrets, credentials, or generated build artifacts

---

## License

This project is proprietary and intended for authorized use only.

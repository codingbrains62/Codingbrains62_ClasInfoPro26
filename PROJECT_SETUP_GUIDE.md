# 🚀 ClasInfoPro26 - Docker Setup Guide

This project contains:

* 🎨 Frontend (Vue + Vite)
* ⚙️ Backend (Node.js + Sails)
* 🗄️ Database (MS SQL Server)

---

# 📦 Prerequisites

Make sure you have installed:

* Docker
* Docker Compose

Check installation:

```bash
docker -v
docker compose version
```

---

# 📁 Project Structure

```
ClasInfoPro26/
│
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Environment Setup

## Frontend `.env`

Create file:

```
frontend/.env.development
```

```env
VITE_API_BASE_URL=/api/v1
VITE_PROXY_TARGET=http://localhost:1337
```

---

## Docker Environment (auto handled)

In `docker-compose.yml`:

```yaml
environment:
  - VITE_PROXY_TARGET=http://backend:1337
```

---

# 🐳 Run Project with Docker

## 🔹 Step 1: Stop old containers

```bash
docker compose down
```

---

## 🔹 Step 2: Build and run

```bash
docker compose up --build
```

---

## 🔹 Step 3: Access Application

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:1337 |
| DB       | localhost:1433        |

---

# 🔁 How It Works

```
Browser
  ↓
Frontend (localhost:5173)
  ↓
/api/v1 (proxy)
  ↓
Backend (backend:1337 - Docker network)
  ↓
MS SQL (mssql:1433)
```

---

# 🧪 API Proxy Configuration

Vite Proxy (vite.config.js):

```js
proxy: {
  '/api/v1/': {
    target: process.env.VITE_PROXY_TARGET || 'http://localhost:1337',
    changeOrigin: true
  }
}
```

---

# 💻 Run Without Docker (Local Dev)

## Backend

```bash
cd backend
npm install
npm start
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

👉 Uses:

```
http://localhost:1337
```

---

# 🛠️ Useful Commands

## View running containers

```bash
docker ps
```

## Stop everything

```bash
docker compose down
```

## Rebuild project

```bash
docker compose up --build
```

## View logs

```bash
docker logs clasinfo_backend
docker logs clasinfo_frontend
```

---

# ❗ Common Issues

## ❌ ECONNREFUSED

* Backend not running
* Wrong proxy target

## ❌ Database connection error

* Wait for MSSQL to fully start
* Check DB credentials

## ❌ Port already in use

```bash
kill-port 5173
```

---

# 💡 Important Notes

* Do NOT use `localhost` inside Docker containers
* Always use service name (e.g. `backend`, `mssql`)
* Use environment variables for flexibility

---

# 🎯 Final Summary

| Mode   | API URL               |
| ------ | --------------------- |
| Local  | http://localhost:1337 |
| Docker | http://backend:1337   |

---

# 🚀 You're Ready!

Now you can:

* Run project using Docker
* Develop locally without conflicts
* Scale to production easily

---

Made with ❤️ by ClasInfo Team

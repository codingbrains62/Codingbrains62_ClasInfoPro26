# ClasInfoPro

## Overview

This repository contains the initial setup for **ClasInfoPro**, a full‑stack web application.

* **Backend:** Sails.js (Node.js MVC framework)
* **Frontend:** Vue 3 with PrimeVue UI components and VueUse composables

The objective of this repository is to establish a clean, scalable, and maintainable foundation following industry best practices. This setup is intended to support future feature development with minimal refactoring.

---

## Tech Stack

---

## Authentication (Passkey Support)

ClasInfoPro supports secure **Passkey Login (WebAuthn / FIDO2)** in addition to standard username/password authentication.
This enables passwordless login using device biometrics (Face ID, Fingerprint, Windows Hello) for improved security and user experience.


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
├── README.md
└── .gitignore
```

---

## Prerequisites

Ensure the following tools are installed on your system:

* Node.js (LTS version recommended)
* npm or yarn
* Git
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

## Environment Variables

Sensitive configuration values are intentionally excluded from version control.

Please refer to:

* `.env.example` (backend)

and create your local `.env` file accordingly.

---

## Development Notes

* This repository currently contains only the **initial project scaffold**.
* No business logic or production features are implemented at this stage.
* All future development should build upon this foundation while adhering to agreed‑upon branching and commit conventions.

---

## Git & Commit Guidelines

* Use clear and descriptive commit messages
* Keep commits small and purpose‑driven
* Do not commit secrets, credentials, or generated build artifacts

---

## License

This project is proprietary and intended for authorized use only.
# Employee Management System

A simple 3-tier Employee Management System:
- Frontend: React + Vite
- Backend: Java 21 + Spring Boot + Maven
- Database: PostgreSQL

## Project structure

```text
employee-management-system/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/employee/
│       │   ├── EmployeeManagementApplication.java
│       │   ├── controller/EmployeeController.java
│       │   ├── entity/Employee.java
│       │   ├── exception/GlobalExceptionHandler.java
│       │   └── repository/EmployeeRepository.java
│       └── resources/application.properties
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── docker-compose.yml
└── .gitignore
```

## Prerequisites

Install Java 21, Maven, Node.js (LTS), npm and Docker Desktop.

## Run locally

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `employee_db`
- Username: `employee_user`
- Password: `employee_pass`

These credentials are only for local development. Do not use them in a shared or production environment.

### 2. Start the Spring Boot backend

Open a terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

### 3. Start the React frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Vite proxies `/api` requests to the backend at `http://localhost:8080`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/{id}` | Get one employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

Example request body:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "department": "Engineering",
  "salary": 65000
}
```

## Environment configuration

`frontend/.env` contains `VITE_API_BASE_URL=/api`. It is read by Vite and is safe for a public API base path only. Never put passwords, tokens, or other secrets in a `VITE_` variable.

Backend database settings can be overridden with `DB_URL`, `DB_USERNAME` and `DB_PASSWORD`. For production, provide these through your deployment secret manager or Kubernetes Secret, not Git.

## Notes for your DevOps implementation

- Push application source to a GitHub source repository.
- Build frontend and backend separately in Jenkins.
- Build and push their container images to Amazon ECR.
- Keep Kubernetes manifests in a separate GitOps repository.
- Let Argo CD watch the GitOps repository and sync changes to EKS.
- For a production setup, use Amazon RDS for PostgreSQL and store DB credentials in AWS Secrets Manager / Kubernetes Secrets.
- This starter project uses Hibernate `ddl-auto=update` for convenience. Review and replace it with a database migration tool such as Flyway before production use.

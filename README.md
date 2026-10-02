# SM EventAura

SM EventAura is a full-stack floral decoration and event consultation platform. Customers can explore decoration designs, create an account, request consultations, track bookings, and contact the business. An admin can review customer requests and update booking status.

## Features

- Luxury green + gold responsive UI
- Hero slideshow using the supplied project assets
- Services and Why SM EventAura sections
- Decoration gallery with search, categories and detail modal
- Customer signup/login/logout with server-side session authentication
- BCrypt password hashing
- Consultation/booking requests stored in MySQL
- Customer dashboard with booking history and status
- Admin dashboard with booking and customer management
- Contact message storage
- CORS and environment-based configuration
- JPA schema auto-update for local development

## Stack

- Frontend: React 19, Vite
- Backend: Java 21, Spring Boot 3.5, Spring Web, Spring Data JPA
- Database: MySQL 8+
- Password hashing: BCrypt

## Requirements

- Node.js 20+ recommended
- Java 21+
- Maven 3.9+
- MySQL 8+

## Database setup

1. Start MySQL.
2. Run `database/schema.sql` in MySQL Workbench.
3. The script creates `sm_eventaura` but does not drop existing data.
4. Configure the backend database password in environment variables or `backend/src/main/resources/application.properties`.

## Backend configuration

Copy `backend/.env.example` values into your environment. Spring Boot does not automatically read a `.env` file, so on Windows PowerShell set variables for the current terminal, for example:

```powershell
$env:DB_PASSWORD="your_mysql_password"
$env:ADMIN_EMAIL="admin@smeventaura.com"
$env:ADMIN_PASSWORD="choose-a-strong-admin-password"
```

Then:

```powershell
cd backend
mvn clean spring-boot:run
```

Backend API: `http://localhost:8081/api`

## Frontend configuration

Copy `frontend/.env.example` to `.env` if you want to change the API URL. The default is:

`VITE_API_URL=http://localhost:8081/api`

Install and run:

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Build

```powershell
cd frontend
npm run build
```

The production frontend output is created in `frontend/dist`.

For the backend:

```powershell
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

## Demo admin

The application creates an admin account on first backend startup using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Change these values before deployment. Do not commit production passwords.

Default development values shown in `.env.example` are:

- Email: `admin@smeventaura.com`
- Password: `ChangeMe123!`

**Change the password before exposing the application publicly.**

## Deployment

- Build the React app and deploy `frontend/dist` to a static hosting provider.
- Deploy the Spring Boot JAR to a Java-compatible server/container.
- Use a managed MySQL database in production.
- Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `CORS_ORIGINS`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` as server environment variables.
- Set `VITE_API_URL` to the public backend API URL before building the frontend.
- Use HTTPS in production.
- Do not commit `.env` files or credentials.

## Testing

Frontend build is the primary local verification command:

```powershell
npm run build
```

Backend integration requires a reachable MySQL instance and valid credentials. The source includes validation and API error handling for the supported flows.

## Project structure

```text
SM/
├── frontend/
├── backend/
├── database/
├── docs/
└── README.md
```

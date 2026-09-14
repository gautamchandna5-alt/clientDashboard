# Agency Project Management & Diet Tracking Portal

A full-stack role-based access control (RBAC) application featuring three distinct user tiers (Admin, Project Manager, Developer). Built with React (Vite/TypeScript), Node.js (Express), and PostgreSQL.

## Local Setup Instructions (Docker Preferred)

To run this project locally, you can use Docker Compose to instantly spin up the PostgreSQL database and the backend/frontend services without configuring local runtimes.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gautamchandna5-alt/clientDashboard




Run with Docker Compose:
Ensure Docker Desktop is running, then execute:

Bash
docker-compose up --build
The Frontend will be available at http://localhost:5173

The Backend will be available at http://localhost:3000

The Database will run on port 5432


your evn(fill out these details)

# Database Credentials
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
DB_NAME=

# Server Configuration
PORT=3000


#JWT Configuration
ACCESS_TOKEN_SECRET=s*hbe2u#*!#E*U@#Y*9*&T&TF
REFRESH_TOKEN_SECRET=fiuw$RDi8huds*YG8bhh*&$#ju2Y$


# Database Schema
The database relies on strict foreign key constraints and ON DELETE CASCADE to maintain referential integrity.
(use these commands to set up the database)

CREATE TYPE user_role AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'DEVELOPER');
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'DEVELOPER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	refresh_token text
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pm_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users


CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    dev_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP





Architectural Decisions
Token Storage Approach: Implemented a highly secure split-token architecture. Short-lived Access Tokens are stored exclusively in React state (memory) to prevent XSS attacks. Long-lived Refresh Tokens are stored in HttpOnly, Secure, SameSite=None cookies to survive page reloads and prevent CSRF attacks. A silent refresh mechanism runs on app load.

WebSocket Library Choice: Due to strict time constraints for this iteration, WebSockets (e.g., Socket.io) were intentionally deferred. Instead, real-time data synchronization is achieved via targeted REST API polling and React useEffect dependency triggers upon user actions.

Known Limitations
Lack of True Real-Time Updates: Because WebSockets are not yet implemented, a second user will not see a task update until they interact with the page or refresh.

Password Reset: No SMTP service is configured; forgot-password flows are not yet supported.



### Explanation Field (Submit this in the required text box)

The hardest problem I solved during this project was implementing secure JWT authentication from scratch, as it was a completely new concept for me. Grasping the lifecycle of tokens—specifically, orchestrating short-lived access tokens in React's volatile memory and long-lived refresh tokens in HttpOnly cookies—required a deep dive into web security. Figuring out how to configure CORS to make Vercel and Render communicate securely across domains with `sameSite: 'none'` and `credentials: true` was a major, but highly rewarding, learning curve.

Because I did not have enough time to implement WebSockets for a true real-time role-filtered feed, I designed a workaround using strict REST architecture. I handled the feed by building precise PostgreSQL `JOIN` queries that filter data exclusively by the user's role ID on the backend. On the frontend, I utilized React's `useEffect` and `useCallback` hooks to aggressively trigger a localized data re-fetch whenever an action (like assigning or completing a task) occurs, mimicking a live feed without manual page reloads.

If I could do one thing differently, I would integrate Socket.io from the very beginning. Relying on REST API refetches works well for this scale, but having a persistent WebSocket connection would significantly reduce backend load and provide a much smoother, inherently real-time user experience.

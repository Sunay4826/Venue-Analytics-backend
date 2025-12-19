## Venue Analytics Backend

Node.js + Express + MongoDB backend for the Venue Analytics application.  
Provides APIs for venues, bookings, members, transactions, and dashboard analytics.

---

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Env Management**: dotenv

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**

   Create a `.env` file in the root of this project:
   ```bash
   MONGODB_URI=<your-mongodb-connection-string>
   PORT=5000
   ```

3. **Run the server**
   ```bash
   # Development (with nodemon, if installed)
   npm run dev

   # or plain node
   npm start
   ```

   The API will be available at `http://localhost:5000`.

---

## Available Scripts

- **`npm start`** – Start the server with Node.
- **`npm run dev`** – Start the server with nodemon (auto-restart on changes).
- **`npm run seed`** – Seed the database with sample data.

---

## API Overview

Base URL: `http://localhost:5000`

Main route groups (exact paths may vary; see `routes/` for details):
- **`/api/venues`** – Manage venues.
- **`/api/bookings`** – Manage bookings.
- **`/api/members`** – Manage members.
- **`/api/transactions`** – Manage transactions.
- **`/api/dashboard`** – Aggregated stats for the dashboard.

---

## Deployment Notes

- Ensure `MONGODB_URI` and `PORT` are configured as environment variables on your hosting platform.
- Never commit your real `.env` file; it is already listed in `.gitignore`.


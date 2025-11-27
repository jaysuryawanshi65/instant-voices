# Instant Voices Backend

This is the backend for the Instant Voices application, replacing Firebase.

## Prerequisites

- Node.js
- MongoDB (running locally on default port 27017)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (optional, defaults provided):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/instant-voices
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/auth/guest`: Create a guest user session.
- `GET /api/voices?userId=...`: Get all voices for a user.
- `POST /api/voices`: Create or update a voice (multipart/form-data).
- `DELETE /api/voices/:id?userId=...`: Delete a voice.

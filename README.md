# AI Document Intelligence Platform

AI-powered document processing, analysis, and Q&A application built with React, Node.js, Express, LangChain, and PostgreSQL.

The app allows you to upload PDF, DOCX, or TXT documents, process them into chunks, generate embeddings, and ask questions about the content using either OpenAI or Anthropic Claude.

## Current Status
- Core application implementation is complete.
- Backend and frontend are wired together for upload and chat workflows.
- The backend builds successfully.
- Full local runtime depends on a working PostgreSQL instance and valid AI provider credentials with available credits.

## Features
- Upload documents in PDF, DOCX, or TXT format
- Extract and split document content into chunks
- Generate embeddings and store them in PostgreSQL with pgvector support
- Ask questions about uploaded documents using RAG-style chat
- Switch between OpenAI and Anthropic Claude as the LLM provider
- View chat history for each uploaded document

## Tech Stack
- Frontend: React 18 + TypeScript
- Backend: Node.js + Express + TypeScript
- AI: LangChain + OpenAI + Anthropic Claude
- Database: PostgreSQL + pgvector
- Dev tooling: Docker, ts-node, dotenv

## Prerequisites
Before running the app locally, make sure you have:
- Node.js 18+ and npm 9+
- PostgreSQL 16+ running locally
- A PostgreSQL database named ai_doc_intelligence
- An OpenAI API key or Anthropic Claude API key with available credits

## Environment Configuration
Create the backend environment file from the example template:

```bash
cd backend
copy .env.example .env
```

Then update [backend/.env](backend/.env) with the correct values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_doc_intelligence
DB_USER=postgres
DB_PASSWORD=postgres

LLM_PROVIDER=anthropic
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_claude_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

> Both OpenAI and Anthropic require billing/credits enabled for the API calls used by embeddings and chat generation.

## Local Development
### 1. Install dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start PostgreSQL
Make sure PostgreSQL is running and the database credentials in [backend/.env](backend/.env) match your local setup.

### 3. Start the backend
```bash
cd backend
npm run dev
```

### 4. Start the frontend
In a second terminal:
```bash
cd frontend
npm start
```

Open http://localhost:3000 in your browser.

## Docker Run
If you prefer Docker:

```bash
docker compose up --build
```

This starts the backend, frontend, and PostgreSQL services together.

## How to Test
1. Upload a small PDF, DOCX, or TXT file.
2. Wait for the document to be processed.
3. Ask a question about the uploaded document.
4. Confirm that the answer appears and the chat history is stored.

## Troubleshooting
- If the backend fails to start, check the PostgreSQL connection settings in [backend/.env](backend/.env).
- If uploads or chat fail, verify the selected AI provider has available credits and a valid API key.
- If port 3000 or 5000 is already in use, stop the conflicting service or change the port settings.

## Project Structure
- [backend](backend) – Express server, document processing, embeddings, and RAG logic
- [frontend](frontend) – React UI for uploading documents and chatting
- [docker-compose.yml](docker-compose.yml) – Local containerized setup for app + database

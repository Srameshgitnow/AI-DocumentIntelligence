# AI Document Intelligence Platform

> Upload documents, search their meaning, and ask grounded questions with an open-source RAG application built for developers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](frontend/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](backend/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)](docker-compose.yml)

AI Document Intelligence is a full-stack document question-answering system. Upload PDF, DOCX, or TXT files, transform them into searchable chunks and embeddings, then use retrieval-augmented generation (RAG) to ask questions about the source material. It supports OpenAI and Anthropic Claude providers and runs locally with Docker, React, Node.js, Express, PostgreSQL, and pgvector.

If this project helps you build an AI document chatbot, private knowledge base, semantic search tool, or RAG prototype, **please star the repository**. Stars help other developers discover the project and guide future development.

## Why use it?

- **Ask instead of scan:** get answers from long documents in seconds.
- **Grounded retrieval:** semantic search finds relevant passages before generation.
- **Developer-friendly:** TypeScript services, a React interface, and Docker setup.
- **Provider choice:** use OpenAI or Anthropic Claude through configuration.
- **Self-hostable foundation:** keep your documents and database in your own environment.

## Features

- Upload PDF, DOCX, and TXT documents
- Extract, clean, and split document content into chunks
- Generate embeddings and store them in PostgreSQL with pgvector
- Ask natural-language questions with retrieval-augmented generation
- Switch between OpenAI and Anthropic Claude
- View chat history for each uploaded document
- Run the complete stack locally with Docker Compose

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Axios, React Dropzone |
| Backend | Node.js 18+, Express, TypeScript, LangChain |
| AI | OpenAI embeddings/chat and Anthropic Claude |
| Data | PostgreSQL 16 and pgvector |
| Operations | Docker Compose, dotenv, ts-node |

## Quick start

## Prerequisites
Before running the app locally, make sure you have:
- Node.js 18+ and npm 9+
- PostgreSQL 16+ running locally
- A PostgreSQL database named ai_doc_intelligence
- An OpenAI API key or Anthropic Claude API key with available credits

## Environment configuration
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

## Local development
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

## Docker run
If you prefer Docker:

```bash
docker compose up --build
```

This starts the backend, frontend, and PostgreSQL services together.

## How to test
1. Upload a small PDF, DOCX, or TXT file.
2. Wait for the document to be processed.
3. Ask a question about the uploaded document.
4. Confirm that the answer appears and the chat history is stored.

## Troubleshooting
- If the backend fails to start, check the PostgreSQL connection settings in [backend/.env](backend/.env).
- If uploads or chat fail, verify the selected AI provider has available credits and a valid API key.
- If port 3000 or 5000 is already in use, stop the conflicting service or change the port settings.

## Contributing and support

Bug reports, feature requests, documentation improvements, and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. For the project’s discoverability and content strategy, see [SEO.md](SEO.md).

If you find this project useful, please [star the repository](../../stargazers) and share it with developers working on document AI, semantic search, or RAG applications.

## Project Structure
- [backend](backend) – Express server, document processing, embeddings, and RAG logic
- [frontend](frontend) – React UI for uploading documents and chatting
- [docker-compose.yml](docker-compose.yml) – Local containerized setup for app + database

# AI Document Intelligence Platform

> Upload documents, search their meaning, and ask grounded questions with an open-source RAG application built for developers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](frontend/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](backend/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)](docker-compose.yml)

Badges: add CI, coverage, and GitHub stars badges at the top of this README after you transfer the repository to GitHub. Example badge URLs use your GitHub `owner/repo` path.

AI Document Intelligence is a full-stack document question-answering system. Upload PDF, DOCX, or TXT files, transform them into searchable chunks and embeddings, then use retrieval-augmented generation (RAG) to ask questions about the source material. It supports Anthropic Claude and OpenAI providers and runs locally with Docker, React, Node.js, Express, PostgreSQL, and pgvector.

If this project helps you build an AI document chatbot, private knowledge base, semantic search tool, or RAG prototype, **please star the repository**. Stars help other developers discover the project and guide future development.

## Security

This repository previously contained committed API keys; those keys have been removed from tracked files. If you cloned the repository earlier, rotate any exposed keys and follow the guidance in [SECURITY.md](SECURITY.md).

## Why use it?

- **Ask instead of scan:** get answers from long documents in seconds.
- **Grounded retrieval:** semantic search finds relevant passages before generation.
- **Developer-friendly:** TypeScript services, a React interface, and Docker setup.
- **Provider choice:** use Anthropic Claude or OpenAI through configuration.
- **Self-hostable foundation:** keep your documents and database in your own environment.

## Features

- Upload PDF, DOCX, and TXT documents
- Extract, clean, and split document content into chunks
- Generate embeddings and store them in PostgreSQL with pgvector
- Ask natural-language questions with retrieval-augmented generation
- Switch between Anthropic Claude and OpenAI
- View chat history for each uploaded document
- Run the complete stack locally with Docker Compose

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Axios, React Dropzone |
| Backend | Node.js 18+, Express, TypeScript, LangChain |
| AI | Anthropic Claude and OpenAI embeddings/chat |
| Data | PostgreSQL 16 and pgvector |
| Operations | Docker Compose, dotenv, ts-node |

## Quick start

## Prerequisites
Before running the app locally, make sure you have:
- Node.js 18+ and npm 9+
- PostgreSQL 16+ running locally
- A PostgreSQL database named ai_doc_intelligence
- An Anthropic Claude API key or OpenAI API key with available credits

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
ANTHROPIC_API_KEY=your_claude_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
OPENAI_API_KEY=your_openai_key_here
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

## API Usage Examples

Upload a document (multipart/form-data):

```bash
curl -v -F "file=@/path/to/mydoc.pdf" -F "title=My Doc" http://localhost:5000/api/documents/upload
```

Ask a question about a document:

```bash
curl -v -X POST http://localhost:5000/api/chat \
	-H "Content-Type: application/json" \
	-d '{"documentId":"<DOCUMENT_ID>", "question":"Summarize the introduction."}'
```

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

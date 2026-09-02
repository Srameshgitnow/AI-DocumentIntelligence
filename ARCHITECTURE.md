# Architecture

This document describes the high-level architecture of the AI Document Intelligence project.

```mermaid
flowchart TD
  Browser[Browser / Frontend]
  Frontend[React App]
  Backend[Express API]
  DB[PostgreSQL + pgvector]
  Storage[Uploads (local or S3)]
  Embeddings[Embeddings Service]
  LLM[LLM Providers (OpenAI / Anthropic)]

  Browser --> Frontend --> Backend
  Backend --> Storage
  Backend --> Embeddings --> LLM
  Embeddings --> DB
  Backend --> DB
  Frontend -->|API| Backend
```

Flow summary:
- The user uploads documents through the React frontend.
- The backend ingests files, extracts text, cleans and splits into chunks.
- Chunks are sent to the embeddings service which calls an LLM provider (OpenAI or Anthropic) to create vectors.
- Vectors are stored in PostgreSQL with the `pgvector` extension.
- For Q&A, the backend performs a semantic search (nearest neighbors) against stored vectors, retrieves context, and forwards it to the LLM for a grounded response.

Deployment notes:
- Supported locally with `docker compose up` (backend, frontend, postgres).
- Environment variables control LLM provider selection and keys; never commit keys to the repository.

DEMO and Screenshot Guide

This file describes how to run a local demo and which screenshots to capture for the `README.md` to improve visibility.

1) Recommended: Run with Docker Compose (preferred)

Prerequisites:
- Docker Desktop (Windows) or Docker Engine (Linux/Mac)

Start the full stack:

```bash
cd c:/ws/ai-document-intelligence
docker compose up --build
```

Or run detached:

```bash
docker compose up --build -d
```

Backend health check:

```bash
curl http://localhost:5000/health
```

If Docker is not available, run manually (requires local PostgreSQL):

```bash
# terminal 1 - start postgres (example using Docker)
docker run --name ai-doc-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=ai_doc_intelligence -p 5432:5432 -d postgres:16

# terminal 2 - backend
cd backend
npm install
copy .env.example .env    # on Windows
# edit backend/.env to point DB_HOST=localhost and set keys
npm run dev

# terminal 3 - frontend
cd frontend
npm install
npm start
```

2) Required screenshots for `README.md` (place images under `docs/screenshots/`):

- `screenshots/home.png` — The app landing page or upload UI (show upload button/dropzone).
- `screenshots/upload-processing.png` — After uploading a document, show processing or chunking results (or the API response JSON with chunksCreated).
- `screenshots/chat_interface.png` — The chat interface showing a question and the AI's answer with source/context.
- `screenshots/document_list.png` — The documents list page showing uploaded documents and timestamps.
- `screenshots/settings_provider.png` — Show provider selection (Anthropic vs OpenAI) or environment guidance.

3) Demo text to use for screenshots

- Use `test-document.txt` (already in the repository) or a small PDF to keep processing fast.

4) Add these assets to the repository

- Create `docs/screenshots/` and add the PNGs. Reference them in `README.md` under a **Screenshots** or **Live Demo** section.

5) If you want, I can generate markdown for the `README.md` screenshot section and insert image links when you provide the screenshots.

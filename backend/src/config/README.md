# Environment Configuration

This directory contains environment configuration templates.

## Backend Configuration (.env)

See [backend/.env.example](backend/.env.example) for all available options.

### Required Variables
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - PostgreSQL database name
- `DB_USER` - PostgreSQL user
- `DB_PASSWORD` - PostgreSQL password
- `OPENAI_API_KEY` - OpenAI API key for embeddings/chat when using OpenAI
- `ANTHROPIC_API_KEY` - Anthropic Claude API key for chat when using Claude
- `LLM_PROVIDER` - Select `openai` or `anthropic`

### Optional Variables
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - CORS origin for frontend (default: http://localhost:3000)
- `NODE_ENV` - Environment mode (development/production)
- `ANTHROPIC_MODEL` - Claude model name (default: claude-3-5-sonnet-latest)

## Frontend Configuration (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Environment Files

- `.env.example` - Template with default values
- `.env` - Your actual configuration (gitignored)
- `.env.local` - Local overrides (gitignored)
- `.env.production` - Production configuration (gitignored)

## Security Notes

⚠️ **Never commit .env files to version control!**

- Keep API keys secret
- Use strong database passwords in production
- Enable HTTPS in production environments
- Implement proper authentication
- Regular security audits

## Docker Environment

When using Docker Compose, environment variables can be set in:
1. `docker-compose.yml` - Service environment section
2. `.env` file - Loaded by Docker Compose

See [docker-compose.yml](docker-compose.yml) for all service configurations.

# Contributing

Thank you for helping improve AI Document Intelligence. Contributions that make document AI, retrieval-augmented generation (RAG), semantic search, and self-hosted development easier are welcome.

## Before you start

1. Search existing issues and pull requests before opening a new one.
2. For a bug, include reproduction steps, expected behavior, actual behavior, and relevant logs without sharing API keys or private documents.
3. For a feature, explain the user problem and proposed solution.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `npm run setup`.
3. Configure `backend/.env` using the project README.
4. Make the smallest change that solves the problem.
5. Run `npm run build` before opening a pull request.
6. Update documentation when behavior, configuration, or supported file types change.

## Pull requests

- Use a clear title that describes the change.
- Keep unrelated formatting changes out of the pull request.
- Explain what changed and how it was tested.
- Never commit `.env` files, API keys, uploaded private documents, or generated build artifacts.

By contributing, you agree that your contributions may be distributed under the project’s MIT license.

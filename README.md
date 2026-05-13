# Pinecone Cursor Plugin

Official [Pinecone](https://www.pinecone.io) plugin for [Cursor](https://cursor.com). Build semantic search, RAG, recommendation systems, and other vector-based applications with Pinecone — directly from your editor.

## What's included

### Skills

Skills are specialized agent capabilities invoked automatically by Cursor Agent or manually via `/skill-name` in chat.

| Skill | What it does |
|-------|-------------|
| `/pinecone-quickstart` | Step-by-step onboarding — create an index, upload data, and run your first search. Choose between a **Database** path (vector search) or **Assistant** path (document Q&A). |
| `/pinecone-query` | Search integrated indexes using natural language text via the Pinecone MCP server. |
| `/pinecone-cli` | Use the Pinecone CLI (`pc`) for terminal-based index and vector management. |
| `/pinecone-assistant` | Create, manage, and chat with Pinecone Assistants for document Q&A with citations. Includes scripts for uploading files, syncing changes, and retrieving context. |
| `/pinecone-full-text-search` | Create, ingest into, and query a Pinecone full-text-search (FTS) index using the preview API. |
| `/pinecone-mcp` | Reference documentation for all Pinecone MCP server tools and their parameters. |
| `/pinecone-docs` | Curated links to official Pinecone documentation, organized by topic. |
| `/pinecone-help` | Overview of all available skills and what you need to get started. |

### MCP Server

The plugin bundles the [Pinecone MCP server](https://github.com/pinecone-io/pinecone-mcp) (`@pinecone-database/mcp`), giving Cursor Agent direct access to your Pinecone resources:

- Create, describe, and delete indexes
- Upsert and query vectors
- Search Pinecone documentation
- Manage index configurations

### Bundled Scripts

Several skills include Python scripts (run via [`uv`](https://docs.astral.sh/uv/)) for operations beyond what MCP provides:

| Script | Skill | Purpose |
|--------|-------|---------|
| `upsert.py` | pinecone-quickstart | Seed an index with sample data |
| `quickstart_complete.py` | pinecone-quickstart | Standalone end-to-end quickstart |
| `create.py` | pinecone-assistant | Create a new Pinecone Assistant |
| `upload.py` | pinecone-assistant | Upload files to an assistant |
| `chat.py` | pinecone-assistant | Chat with an assistant |
| `context.py` | pinecone-assistant | Retrieve context snippets from an assistant |
| `list.py` | pinecone-assistant | List all assistants in your account |
| `sync.py` | pinecone-assistant | Sync local files to an assistant |
| `ingest.py` | pinecone-full-text-search | Bulk-ingest a prepared JSONL into an FTS index |

## Installation

Run the following command in Cursor chat:

```
/add-plugin pinecone
```

Or install directly from the marketplace: [cursor.com/marketplace/pinecone](https://cursor.com/marketplace/pinecone)

## Prerequisites

- **Pinecone account** — free at [app.pinecone.io](https://app.pinecone.io/?sessionType=signup)
- **API key** — create one in the Pinecone console, then add it to a `.env` file at your workspace root:
  ```
  PINECONE_API_KEY=your-key
  ```
  The bundled MCP config loads this file via Cursor's [`envFile`](https://cursor.com/docs/mcp) field, so you don't need to export the key in your shell. (If you prefer, `export PINECONE_API_KEY="your-key"` also works for terminal scripts.)
- **Node.js v18+** — required for the MCP server (`npx`)

### Optional

| Tool | What it enables | Install |
|------|----------------|---------|
| [Pinecone CLI](https://docs.pinecone.io/guides/operations/pinecone-cli) (`pc`) | Terminal-based index management, batch operations | `brew tap pinecone-io/tap && brew install pinecone-io/tap/pinecone` |
| [uv](https://docs.astral.sh/uv/) | Run the bundled Python scripts | [Install guide](https://docs.astral.sh/uv/getting-started/installation/) |

## Getting started

1. Install the plugin from the [Cursor Marketplace](https://cursor.com/marketplace)
2. Add `PINECONE_API_KEY=your-key` to a `.env` file at your workspace root (Cursor will load it into the MCP server via `envFile`)
3. Open Cursor Agent chat and type `/pinecone-quickstart` to get started
4. Verify the MCP server is connected: Cursor Settings > Features > Model Context Protocol

## Verifying the installation

| Component | Where to check |
|-----------|---------------|
| Skills | Cursor Settings > Rules — listed under "Agent Decides" |
| MCP Server | Cursor Settings > Features > Model Context Protocol |
| Commands | Type `/` in Agent chat and search |

## Links

- [Pinecone Documentation](https://docs.pinecone.io)
- [Pinecone MCP Server](https://github.com/pinecone-io/pinecone-mcp)
- [Pinecone Discord](https://discord.gg/pinecone)

## License

[Apache-2.0](LICENSE)

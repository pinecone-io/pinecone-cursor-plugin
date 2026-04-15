# Pinecone Cursor Plugin

Official [Pinecone](https://www.pinecone.io) plugin for [Cursor](https://cursor.com). Build semantic search, RAG, recommendation systems, and other vector-based applications with Pinecone — directly from your editor.

## What's included

### Skills

Skills are specialized agent capabilities invoked automatically by Cursor Agent or manually via `/skill-name` in chat.

| Skill | What it does |
|-------|-------------|
| `/quickstart` | Step-by-step onboarding — create an index, upload data, and run your first search. Choose between a **Database** path (vector search) or **Assistant** path (document Q&A). |
| `/query` | Search integrated indexes using natural language text via the Pinecone MCP server. |
| `/cli` | Use the Pinecone CLI (`pc`) for terminal-based index and vector management. |
| `/assistant` | Create, manage, and chat with Pinecone Assistants for document Q&A with citations. Includes scripts for uploading files, syncing changes, and retrieving context. |
| `/mcp` | Reference documentation for all Pinecone MCP server tools and their parameters. |
| `/docs` | Curated links to official Pinecone documentation, organized by topic. |
| `/help` | Overview of all available skills and what you need to get started. |

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
| `upsert.py` | quickstart | Seed an index with sample data |
| `quickstart_complete.py` | quickstart | Standalone end-to-end quickstart |
| `create.py` | assistant | Create a new Pinecone Assistant |
| `upload.py` | assistant | Upload files to an assistant |
| `chat.py` | assistant | Chat with an assistant |
| `context.py` | assistant | Retrieve context snippets from an assistant |
| `list.py` | assistant | List all assistants in your account |
| `sync.py` | assistant | Sync local files to an assistant |

## Installation

Run the following command in Cursor chat:

```
/add-plugin pinecone
```

Or install directly from the marketplace: [cursor.com/marketplace/pinecone](https://cursor.com/marketplace/pinecone)

## Prerequisites

- **Pinecone account** — free at [app.pinecone.io](https://app.pinecone.io/?sessionType=signup)
- **API key** — create one in the Pinecone console, then set it:
  ```bash
  export PINECONE_API_KEY="your-key"
  ```
- **Node.js v18+** — required for the MCP server (`npx`)

### Optional

| Tool | What it enables | Install |
|------|----------------|---------|
| [Pinecone CLI](https://docs.pinecone.io/guides/operations/pinecone-cli) (`pc`) | Terminal-based index management, batch operations | `brew tap pinecone-io/tap && brew install pinecone-io/tap/pinecone` |
| [uv](https://docs.astral.sh/uv/) | Run the bundled Python scripts | [Install guide](https://docs.astral.sh/uv/getting-started/installation/) |

## Getting started

1. Install the plugin from the [Cursor Marketplace](https://cursor.com/marketplace)
2. Set your `PINECONE_API_KEY` environment variable
3. Open Cursor Agent chat and type `/quickstart` to get started
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

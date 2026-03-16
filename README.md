# Pinecone Cursor Plugin

Official Pinecone plugin for Cursor. Provides skills, rules, and a Pinecone MCP server integration for building with Pinecone.

## Skills

| Skill | Description |
|-------|-------------|
| `quickstart` | Onboarding — create an index, upload data, run your first search |
| `query` | Natural language search across Pinecone indexes via MCP |
| `cli` | Pinecone CLI (`pc`) for index and vector management |
| `assistant` | Pinecone Assistants for document Q&A with citations |
| `mcp` | Reference docs for all MCP server tools and parameters |
| `docs` | Organized links to official Pinecone documentation |
| `help` | Overview of all skills and getting-started guidance |

## MCP Server

The plugin bundles the [Pinecone MCP server](https://github.com/pinecone-io/pinecone-mcp) (`@pinecone-database/mcp`). Requires a `PINECONE_API_KEY` environment variable.

## Prerequisites

- [Pinecone account](https://app.pinecone.io) (free)
- Pinecone API key
- Node.js v18+ (for the MCP server)

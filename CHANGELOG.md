# Changelog

## [1.2.0] - 2026-09-03

### Changed
- **Full-text search now requires `pinecone` Python SDK >= 10.0.0.** The document-schema
  API graduated out of `pinecone.preview` and is a first-class, SemVer-covered part of the
  SDK, reached directly off the client: `pc.indexes`, `pc.index(name)`. The wire API
  version is `2026-07`.
- `scripts/ingest.py` pins `pinecone==10.0.0` and calls `pc.index(name)` in place of
  `pc.preview.index(name)`.
- `--batch-size` on `scripts/ingest.py` now defaults to 50 rather than 100, with the
  large-vector guidance moved from 50 to 25. Fewer payload-size errors out of the box.

### Removed
- **`pinecone.preview` is deleted in SDK 10.0.0 — there is no shim.** Importing it raises
  `ModuleNotFoundError`. The skill keeps migration notes for anyone carrying code over
  from the preview API, including the traps that changed shape rather than disappearing.

### Added
- **Per-field updates.** `documents.update(...)` replaces the fetch, modify, re-upsert
  workaround the preview API forced.
- **Namespace management.** Create, describe, list, and delete namespaces through the API.
  The preview API could write to a namespace but not manage one.
- **`documents.list(...)`** enumerates document IDs in a namespace, lazily paginated,
  sorted by `_id`, optionally filtered by `prefix`.

### Fixed
- **Filterable metadata does not belong in the schema.** On a managed index the server
  rejects any schema-declared filterable field with a `400` — string, string list, float,
  and boolean alike. Put those fields on upserted documents instead, where they
  auto-index for filtering with nothing to configure.
- **A hybrid index must declare its `sparse_vector` field at create time.** `metric="dotproduct"`
  on the dense field is no longer a hybrid declaration by itself. The create call succeeds
  either way, but without a declared `sparse_vector` field the sparse writes are refused
  later, often from a different part of the codebase. Schemas are immutable, so fixing it
  means creating a new index.

## [1.1.0] - 2026-08-11

### Fixed
- **Skills pointed at slash commands that do not exist.** The assistant scripts told you to run `/pinecone:assistant-chat`, `/pinecone:assistant-upload`, `/pinecone:assistant-create`, `/pinecone:assistant-context`, and `/pinecone:assistant-list` — 13 references across four scripts. This plugin declares no commands, so every one of them was a dead end. They now name the script you can actually run, for example `uv run chat.py --assistant NAME --message "YOUR QUESTION"`.
- **Full-text search: `add_integer_field()` does not exist.** The FTS skill named it in `SKILL.md`, `references/schema-design.md`, and `references/onboarding-walkthrough.md`. Calling it raises `AttributeError`, so an agent following the documented schema-design path failed before it could create an index. Use `add_float_field()` — `float` is the only numeric wire type.
- **`add_boolean_field()` does exist.** The docs said it didn't and recommended an `add_custom_field("name", {"type": "boolean", ...})` workaround.
- **`include_fields` default was wrong.** Omitting it does not return `_id` + `_score` only. The key is left off the request and the server returns every stored field.
- The full-text-search skill's heading was its own identifier rather than a title.

### Added
- The developer-reference skill now lists the full-text-search guide.
- The FTS skill explains why to pin the SDK exactly: `pinecone.preview` sits outside SemVer, and `documents.fetch` and `documents.delete` both lost their `filter` parameter between 9.0.0 and 9.1.0.

### Changed
- Setup guidance is more explicit that the bundled MCP config reads `.env` through Cursor's `envFile` field, and that scripts can be run with `uv run --env-file .env`.
- Skills state once, up front, how to ask you to choose between options, rather than repeating it at each step.
- Removed 12 `.gitkeep` placeholder files from directories that are no longer empty.

### Note for contributors
Everything under `skills/` is now generated from [pinecone-io/skills](https://github.com/pinecone-io/skills) and arrives here by pull request. Direct edits are overwritten by the next sync — send changes to the source repository instead.

## [1.0.1] - 2026-08-05

### Fixed
- **Pinecone SDK 9.x compatibility.** The bundled scripts pinned `pinecone>=8.0.0`, which resolved to 9.1.0 — where the assistant API moved and the data plane became keyword-only. Five of nine scripts were broken and `chat.py` failed at import. All scripts now pin `pinecone==9.1.0` and declare `requires-python = ">=3.10"`.

---

Releases before 1.0.1 are not recorded here; this file starts at the point the
changelog was introduced.

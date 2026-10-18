# Libri v2 design and architecture review

This review accompanies the `claude-2` prototype. It turns the visual exploration into an implementation
direction and records the differences from the current Libri application.

## Product direction

Libri should feel like a local-first library manager rather than a storefront. The primary workspace is a
searchable catalog with explicit storage state, collection membership, and fast actions. Remote account data,
local files, and derived metadata should remain separate concerns so that browsing still works while a sync or
download is in progress.

The v2 prototype demonstrates these product areas:

- **Library:** grid/list browsing, search, filters, tags, download state, and multi-root storage.
- **Inspector:** item metadata, formats, locations, collections, summaries, and file actions.
- **Sheets:** collection and download workflows presented as focused modal surfaces.
- **Insights:** counts, formats, storage, and other library-level visual summaries.
- **Settings:** storage roots, appearance, file associations, summaries, and optional agent/MCP access.
- **Archive browsing:** a way to inspect compressed content before extracting or opening it.

## Comparison with the current application

The current Rust/GPUI application already provides a solid shell for the first slice: a `LibraryRootView`,
catalog and detail views, collection management, settings, authentication state, and SDK-backed services. The
v2 design is therefore an extension of the existing model, not a replacement of the window architecture.

| Area | Current baseline | v2 direction | Required change |
| --- | --- | --- | --- |
| Catalog | Catalog view with search/filtering and item detail | Persistent grid/list modes, richer filters, tags, and clearer local/remote state | Add a view-state model and an explicit item availability state; keep rendering independent of SDK requests |
| Collections | Collection section and manage-collections dialog | First-class collection browsing and batch operations | Promote collections from an item-detail action to a navigable domain with its own list/query model |
| Storage | Download/file-presence utilities and settings | Multiple named storage roots, destinations, and per-root capacity/state | Introduce a storage service and persisted root configuration; route download jobs through it |
| Downloads | Existing download controls and concurrency setting | Queue, progress, pause/retry, destination selection, and batch downloads | Add a durable job model plus events for progress and recovery after restart |
| Item detail | Detail panel with metadata and collections | Inspector with locations, formats, summary, archive contents, and contextual actions | Split remote product metadata from local file metadata and load expensive sections lazily |
| Search and tags | Catalog-oriented filtering | Unified search across title, author, tags, collections, and local paths | Add an indexed local metadata store; do not make every keystroke an API request |
| Insights | No dedicated analytics surface | Library statistics and storage/format charts | Build read-only projections from local catalog and file metadata; keep charts optional and non-blocking |
| Agent/MCP | No user-facing agent surface | Explicit opt-in, scoped tools, and activity visibility | Add a permissioned adapter over application services; never expose credentials or unrestricted filesystem access |
| Themes and presentation | Settings window and existing appearance controls | User-selectable themes, density, cover styles, and presentation preferences | Centralize appearance preferences and make them available to all library surfaces |
| Archive files | No archive browser in the current baseline | Inspect archive entries and choose files before extraction/opening | Add a sandboxed archive reader with size/depth limits and a separate extraction workflow |

## Recommended architecture

Keep the current layering and extend it deliberately:

```text
GPUI views
    -> view models / application commands
        -> domain services
            -> local catalog + job store
            -> storage service
            -> dtrpg-sdk connection
            -> optional agent/MCP adapter
```

### Domain boundaries

1. **Remote library service** owns authentication, synchronization, product metadata, and collection changes
   against the SDK.
2. **Local catalog service** owns normalized products, files, tags, collections, roots, and derived metadata.
3. **Storage service** owns root validation, file placement, presence checks, archive inspection, and opening
   files with configured applications.
4. **Download service** owns durable jobs, concurrency, progress, retry, cancellation, and restart recovery.
5. **Insights service** reads projections from the local catalog and never blocks the catalog UI on remote work.
6. **Agent gateway** exposes narrowly scoped commands and read models, with per-tool permissions and an audit
   trail. It should depend on application services, not on GPUI entities or private SDK state.

The UI should consume snapshots and events from these services. Avoid putting filesystem scanning, archive
parsing, or SDK calls directly in view render functions.

## Delivery sequence

1. **Stabilize the shared baseline:** define catalog, item, collection, storage-root, and download-job models;
   persist view preferences; preserve current login and catalog flows.
2. **Make local state authoritative for presentation:** synchronize remote products into the local catalog and
   render availability, tags, collections, and locations from it.
3. **Add multi-root downloads:** validate roots, implement durable jobs and progress events, then add batch
   actions to the catalog and collections views.
4. **Expand the inspector:** add local files, archive preview, summaries, and format-specific actions behind
   lazy-loaded panels.
5. **Add tags and insights:** index tags and metadata locally; derive charts from the same projections used by
   the UI.
6. **Add agent/MCP last:** introduce opt-in permissions, scoped commands, redacted responses, and audit events
   only after the application services are stable.

## Non-functional decisions

- **Offline-first:** cached catalog and local files remain browseable without credentials or network access.
- **Safe filesystem behavior:** never overwrite an existing file silently; use atomic downloads and explicit
  conflict choices.
- **Responsive UI:** all sync, scanning, archive inspection, and downloads run off the GPUI render path.
- **Recoverability:** persist jobs and sync checkpoints so interruption does not lose user intent.
- **Least privilege:** the optional agent integration is disabled by default and scoped to selected roots and
  operations.
- **Cross-platform:** keep paths, file associations, placeholders, and native integrations behind platform
  adapters; the domain model should use platform-neutral identifiers.

## Prototype limitations

The prototype is intentionally a design artifact. Its data is static, its controls demonstrate intended flows,
and its browser-loaded React/Babel setup is not a production dependency. The next implementation step is to
translate the screens into service contracts and state transitions, not to copy the prototype component tree
into Rust.

# BF-04 — Game Database Explorer

Routes:
- /build-firini/database
- /en/build-forge/database
- /de/build-schmiede/database

Six category groups cover all 34 entity kinds defined by the private catalog SQL enum. Search uses the selected language's name and description. Filters include data type, patch, live/PTR/historical channel and class. A missing language is not shown as a fallback. Each record includes source and review date. The display is paginated and has mobile-friendly layout.

The public artifact, content/forge/public-catalog.json, is intentionally empty. It is not a private import bundle or a copy of legacy data. Do not add records by hand from unapproved sources. Future export must apply source permission, snapshot/entity review and locale review checks, verify publication and monetization rights where relevant, and strip internal permission evidence. The parser is a format validation/allowlist boundary, not a licensing or truth check. No Supabase schema exposure or client credential is introduced.

The preview route is noindex until useful data is available. No sitemap entry yet. Once publication is authorized, implement reviewed export with revocation handling and only then revise indexing.

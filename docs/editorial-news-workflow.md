# Dungeon Diaries — editorial news workflow

Status: preview-only tooling. No scraping, source polling, scheduled job, live API call or automatic publication is enabled.

## Source policy

Use official Blizzard news links. Review the publisher's [legal terms](https://www.blizzard.com/en-us/legal). Linking or AI rewriting is not permission to republish. Where automated collection is desired, first confirm an authorized feed/API and its terms or obtain permission. A search alert containing links can be used for discovery; an editor opens the source and records brief independently worded facts, never full article text, copyrighted artwork, or translated patch lists. Separate the announcement date from the scheduled release date. Use editorial analysis and avoid speculative claims.

A single patch-notes page may be updated in place. The article ID and verified update key identify an edition; local publishing rejects duplicates. Corrections require editorial review.

## Local workflow

Create a private facts.json (fixture values below, not real news):

```json
{"sourceUrl":"https://news.blizzard.com/en-us/article/12345678/example","kind":"patch","announcementDate":"2025-01-01","releaseDate":null,"updateKey":"example-version","facts":["Independently verified fact one.","Independently verified fact two."],"factsReviewed":true,"rightsAcknowledged":true}
```

Option A: no API charges. Generate a prompt, use your preferred AI manually, save its JSON result to translations.json, then create the draft.

```sh
node scripts/editorial/news.mjs prompt facts.json
node scripts/editorial/news.mjs draft facts.json translations.json > draft.json
```

Option B: configure OPENAI_API_KEY and OPENAI_MODEL in a private shell or server environment. The selected model must support structured outputs. Never commit secrets. API billing is separate from ChatGPT; cap spend before enabling. This sends only the reviewed input and requests structured TR/EN/DE output.

```sh
node scripts/editorial/news.mjs generate facts.json > draft.json
```

Validate, compare all three languages with the notes, review rights, numbers, dates and terminology, then approve explicitly:

```sh
node scripts/editorial/news.mjs validate draft.json
node scripts/editorial/news.mjs publish draft.json "Editor name" YYYY-MM-DD
```

Publication writes local Markdown and registry entries only. Review the Git diff, create a preview PR, then merge to production separately. The same article appears in the Diablo hub and translated guide catalog, with official source and AI-assistance disclosure. Do not commit private draft input files. No refresh of gameplay data or Supabase changes is implied.

## Next phase

Once authorized source access and budget exist: scheduled discovery → draft queue → editor checks and approval → preview → production. Add a persistent editorial queue and authenticated UI when needed; keep ingestion and publish privileges separate. Build Forge game-data synchronization is a separate workflow and should not treat news summaries as an authoritative item/skill catalog.

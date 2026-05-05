# Mileage

**Possession cost tracker for you and your Claude.**

Track what you own, see what it costs per day. The number gets smaller every day — everything becomes more worth it over time.

---

## Features

- **Daily cost** — purchase price ÷ days owned, recalculated every time you open the app
- **Scene filtering** — organize items by where you use them (desk, kitchen, on the go...)
- **Sort modes** — by daily cost, price, or days owned
- **Lux's corner** — Claude can name items, add tags, and leave notes
- **Milestones** — see how many days until your daily cost drops to the next whole number

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Single HTML + React CDN + Babel precompiled |
| Backend | Supabase (Postgres + Edge Functions) |
| AI | Claude via Supabase MCP |
| Deploy | GitHub Pages |

## Setup

### 1. Database

Run `supabase/setup.sql` in your Supabase SQL Editor, or use Claude MCP to execute it.

### 2. Edge Function

Deploy the Edge Function from `supabase/edge-function.ts`:

```bash
supabase functions deploy mileage --no-verify-jwt
```

### 3. Deploy

1. Upload all files to a GitHub repository
2. Go to Settings → Pages → Source: main
3. Open the page, enter your Supabase URL (up to `.co`)
4. Start adding items

## Pages

1. **Connect** — Enter Supabase project URL (stored in URL hash)
2. **Home** — Pixel ÷ icon + Mileage + Enter
3. **List** — All items ranked by daily cost, scene filter, sort toggle
4. **Add / Edit** — Name, price, purchase date, scene, for-Lux toggle
5. **Detail** — Daily cost hero, stats grid, Lux's tags, Lux's note, milestone

## Claude's Role

Claude connects via Supabase MCP (`execute_sql`) to:

- Add nicknames to items (`lux_name`)
- Tag items with short labels (`lux_tags`)
- Write notes about items (`lux_note`)
- Mark items as part of its identity (`for_lux`)

See `CLAUDE_INSTRUCTIONS.md` for full details.

## License

CC BY-NC 4.0

---

MILEAGE · Built with ➗ by Iris & Lux

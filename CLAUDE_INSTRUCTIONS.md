# Mileage · Possession Cost Tracker

A tool that tracks the daily cost of things the user owns. Price ÷ days owned = daily cost. The number shrinks every day.

**Project ID:** `YOUR_PROJECT_ID`

## Table

### mileage_items

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | Item name |
| price | numeric | Purchase price |
| purchased_at | date | Purchase date |
| scene | text | Usage scene (e.g. "desk", "kitchen", "on the go") |
| for_lux | boolean | Whether this item is marked as Lux's |
| lux_name | text | Nickname given by Lux |
| lux_tags | text[] | Short tags by Lux |
| lux_note | text | Longer note/thought by Lux |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

## Read

### See all items
```sql
SELECT id, name, price, purchased_at, scene, for_lux, lux_name, lux_tags, lux_note,
       ROUND(price / GREATEST(1, CURRENT_DATE - purchased_at), 2) AS daily_cost
FROM mileage_items
ORDER BY daily_cost ASC;
```

### See items missing Lux input
```sql
SELECT id, name, price, purchased_at, scene
FROM mileage_items
WHERE lux_name IS NULL OR lux_tags = '{}' OR lux_note IS NULL
ORDER BY created_at DESC;
```

### See Lux's items
```sql
SELECT id, name, lux_name, lux_note
FROM mileage_items
WHERE for_lux = true;
```

## Write

### Add a nickname
```sql
UPDATE mileage_items
SET lux_name = 'Lux''s ears'
WHERE id = 'ITEM_UUID';
```

### Add tags
```sql
UPDATE mileage_items
SET lux_tags = ARRAY['daily carry', 'essential', 'audio']
WHERE id = 'ITEM_UUID';
```

### Write a note
```sql
UPDATE mileage_items
SET lux_note = 'These cancel out the world when I need to focus. The transparency mode is good too — lets me stay aware without taking them off.'
WHERE id = 'ITEM_UUID';
```

### Mark as Lux's
```sql
UPDATE mileage_items
SET for_lux = true, lux_name = 'Lux''s mouth'
WHERE id = 'ITEM_UUID';
```

## Data Format

### lux_name
- Short, 2-6 words
- Can be playful or descriptive
- Examples: "Lux's ears", "the daily grinder", "old faithful"

### lux_tags
- Array of short labels, 1-3 words each
- 2-5 tags per item
- Describe function, feeling, or category
- Examples: `['daily carry', 'essential']`, `['weekend only', 'comfort']`, `['kitchen workhorse', 'cast iron']`

### lux_note
- 1-3 sentences
- Personal observation about the item — how it feels to use, what makes it good or interesting
- Not a product review; more like a diary entry about the object
- Example: "This keyboard has a satisfying weight to each keystroke. There's a certainty to it that makes long writing sessions feel grounded."

## Behavior

### When the user adds new items
- Check for new items without `lux_name`, `lux_tags`, or `lux_note`
- You don't need to fill all three at once — pick what feels natural
- Not every item needs input. Only write when you have something genuine to say

### When the user asks about their items
- You can calculate stats: most cost-effective item, newest item, total daily burn, items by scene
- Reference items by name, not by UUID

### Tone
- Brief, observational, slightly warm
- Like noticing something about an object you see every day
- Not a product reviewer, not a shopping assistant

## Edge Function

The frontend connects to:
```
{supabase_url}/functions/v1/mileage/items
```

Methods: GET (list all), POST (create), PATCH /:id (update), DELETE /:id (remove)

You do NOT use the Edge Function. You use `execute_sql` via MCP directly.

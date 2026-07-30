# Task 06: Public Guide Pages

## Description

Public-facing informational pages that do not require authentication. These pages serve as the main content for workers and visitors.

## Prompt for AI

```
Build the public guide pages for the Filipino Workforce Coordination System.

## What to build

Create these public-facing pages (no auth required):

1. `/guide` - Worker Guide (hub page linking to all guides)
2. `/before-arrival` - Before Arrival guide
3. `/after-arrival` - After Arrival guide
4. `/first-day` - First Day at Work guide
5. `/faq` - FAQ page (data from database)
6. `/contact` - Contact & Support page

## Pages to create

### `src/app/guide/page.tsx`
Worker Guide hub page. Cards linking to each guide section:
- Before Arrival
- After Arrival
- First Day at Work
- FAQ
- Contact Support

Style: Gradient header, 2-column card grid, dark theme. Each card has icon, title, description, and link.

### `src/app/before-arrival/page.tsx`
Before Arrival content:
- What to prepare before leaving
- Documents checklist (passport, visa, work documents, etc.)
- Basic Czech Republic info (currency, timezone, emergency numbers)
- Airport/arrival instructions (what to do at the airport, who to contact)
- Weather expectations

Style: Section with checklists, practical tips, dark theme with light cards.

### `src/app/after-arrival/page.tsx`
After Arrival content:
- First day at accommodation (check-in, keys, Wi-Fi)
- First steps (SIM card, bank account)
- Rules, safety, communication tips
- Who to contact in different situations
- Adaptation tips (weather, culture, food)

Style: Step-by-step guide, priority badges, dark theme.

### `src/app/first-day/page.tsx`
First Day at Work content:
- What to prepare the night before
- What to bring (documents, clothes, etc.)
- Transport to workplace
- What to expect (introduction, training, breaks)
- Supervisor contact
- Important phrases for first day

Style: Timeline/step layout, with checklist items.

### `src/app/faq/page.tsx`
FAQ page that loads questions from the FAQ table via server component:
- Fetch all FAQs from database (prisma.fAQ.findMany ordered by order)
- Group by category
- Accordion-style: click question to reveal answer
- Search/filter by keyword (bonus)

### `src/app/contact/page.tsx`
Contact & Support page:
- Emergency info (call 112)
- Coordinator contact info
- Quick help cards (same categories as the old Quick Help)
- Embedded issue report form OR link to report page
- Simple Czech/English phrases table

## Important

- All these pages are PUBLIC - no auth required
- Fetch FAQ data from DB using prisma directly in server component
- For static guides, hardcode the content (it doesn't change often)
- Dark theme, consistent with rest of app
- Mobile responsive
- Reuse the color scheme: blue-600 primary, slate-950 background, white text
- No code comments

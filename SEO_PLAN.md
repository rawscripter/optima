# Optima SEO Plan — Rank on Google for Image Optimization

## Target Keywords

| Keyword | Volume | Difficulty | Priority |
|---|---|---|---|
| `woocommerce image optimizer free` | Medium | Low | #1 |
| `webp converter woocommerce` | Medium | Low | #1 |
| `wordpress product image resize tool` | Low | Low | #2 |
| `batch convert jpg to webp online free` | High | High | #3 |
| `webp image converter online free` | Very high | Very high | Skip |

---

## Phase 1 — On-page Content (biggest impact)

Single-page tools rank poorly — no content for Google to index. Add a landing section **below the tool** in `app/page.tsx`:

- [ ] `<h2>` heading: "How to optimize WooCommerce product images"
- [ ] Feature list with keyword-rich copy
- [ ] FAQ section with these questions:
  - "What size should WooCommerce product images be?"
  - "Should I use WebP for WooCommerce?"
  - "How do I bulk resize product images for WordPress?"
- [ ] Add `FAQPage` JSON-LD structured data in `app/layout.tsx`

---

## Phase 2 — Authority Signals (this month)

- [ ] Submit sitemap to **Google Search Console** → `optima.appluto.com/sitemap.xml`
- [ ] Submit to free tool directories:
  - Product Hunt
  - AlternativeTo
  - Toolify.ai
  - There's An AI For That
- [ ] Post in communities (genuine "I built a free tool" posts):
  - r/woocommerce
  - r/Wordpress
  - WooCommerce Facebook groups
- [ ] Get 1 backlink from a WordPress/WooCommerce blog reviewing the tool

---

## Phase 3 — Content Moat (ongoing)

Add a `/blog/` route with these posts:

- [ ] "WooCommerce Image Size Guide 2025" — targets high-volume keyword
- [ ] "WebP vs JPEG for WooCommerce: Speed Test" — linkbait for backlinks
- [ ] "How to Bulk Convert Product Images to WebP" — tutorial that links to tool

---

## Technical SEO (already done)

- [x] Full metadata with Open Graph + Twitter cards (`app/layout.tsx`)
- [x] `robots.ts` — allows all crawlers, points to sitemap
- [x] `sitemap.ts` — auto-generated sitemap at `/sitemap.xml`
- [x] `opengraph-image.tsx` — dynamic OG preview image

---

## Timeline

| Phase | Expected result |
|---|---|
| Phase 1 + 2 | Page 1 for low-competition keywords in 2-3 months |
| Phase 3 | Competitive terms in 4-6 months |
| Product Hunt launch | Traffic within days |

# Monks Homepage Recreation

High-fidelity recreation of the [Monks](https://www.monks.com/) homepage built with React, TypeScript, Vite, Tailwind CSS, GSAP + ScrollTrigger, Lenis smooth scroll, and Lucide React.

## Implemented Homepage Sections (Original Order)

1. **Header & Navigation** — `.monks` wordmark, desktop dropdown navigation drawers (`Solutions`, `Marketing Services`, `Technology Services`, `Work`, `About Us`, `Connect`), and GSAP-animated fullscreen mobile navigation overlay.
2. **Hero** — Full-viewport ambient sizzle video (`Monks-Sizzle_1280x720.mp4`), serif/sans headline pairing (`Transforming brands / for the real-time world`), twin pill-and-circle CTA, hand-drawn `SCROLL` hint, and Play/Pause background control.
3. **Four Strategic Solutions** — Staggered 4-column editorial showcase (`01 Real-Time Brands`, `02 Media Acceleration`, `03 Marketing Orchestration`, `04 AI Transformation`) with interactive capability drawers.
4. **Connect** — Editorial split featuring `"What can we do for you?"` with scroll-drawn SVG scribble around `"you"` and `"Reach out"` CTA.
5. **Our Agents** — `monks.flow` manifesto section and interactive `16:9` custom video player with poster image, loading state, progress scrubber, mute toggle, and fullscreen support.
6. **Our Expertise** — Asymmetric 3-column grid featuring `Boomtown Unboxed`, `Owning the Answer: The Marketer’s Playbook for AEO, GEO and the AI Search Era`, and `CES 2026: From Vision to Velocity`.
7. **Featured Watch Video** — Scroll-reactive `#FFB2E8` pink canvas, giant `"m [O] nk"` lockup flanked by animated `"meet the monk"` outline marquee, circular masked Sir Martin Sorrell video, and vertical theater player modal.
8. **On Our Minds** — Hairline-divided editorial index of 6 reports and articles with mixed sans/serif typography and interactive reader modals.
9. **Contact Form** — Conversational `.monks` chat intro (`#5B1BFF` bubble) paired with a validated 8-step interactive lead form.
10. **Footer** — Deep `#191715` directory, governance policies, interactive language switcher, and `#FFB2E8` newsletter signup modal.

## Scripts

```bash
npm install
npm run dev      # Starts dev server on http://localhost:3000
npm run lint     # TypeScript check (tsc --noEmit)
npm run build    # Production Vite build
```

See `VIDEO_ASSETS.md` for the full media extraction log.

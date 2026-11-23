# VIDEO_ASSETS.md — Extracted Media Inventory from `https://www.monks.com/`

All media assets below were inspected directly from `https://www.monks.com/` using headless Chromium and Chrome DevTools network monitoring.

## Video Assets

| # | Homepage Section | Role | Original Source URL | Format | Natural Dimensions | Size | Playback & Loading Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Hero — Transforming brands for the real-time world** | Background ambient sizzle reel | `https://www.monks.com/data/s3fs-public/2026-08/Monks-Sizzle_1280x720%20%283%29.mp4?VersionId=YunZ_b.L72KXocRIFA8._9qbQwtWQSAe` | `video/mp4` | `1280 × 720` (16:9) | `9.56 MB` | Downloaded locally to `src/assets/videos/monks-hero-sizzle.mp4`. Plays with `autoPlay`, `muted`, `loop`, `playsInline`, `object-cover`, plus user-accessible Play/Pause control. |
| 2 | **Our Agents — Monks.Flow Manifesto** | Interactive video player (`00:58`) | `https://www.monks.com/data/2026-07/2026_monks-flow_brand-manifesto_v021-MonksBrand.mp4?VersionId=TYvsmadeK_czP8bOFNHFINTAKZercins` | `video/mp4` | `1920 × 1080` (16:9) | `202.31 MB` | Streamed directly from the verified CloudFront/S3 URL with `preload="none"` and local poster `src/assets/images/monks-flow-thumbnail.png` (`1728 × 974`) to avoid eager 200 MB download on page load. Includes custom Play/Pause overlay, scrubber, mute toggle, loading spinner, and fullscreen. |
| 3 | **Featured Watch — Sir Martin Sorrell** | Circular masked loop + interactive theater modal | `https://www.monks.com/data/2025-09/SMS-Personalization.mp4?VersionId=EeMCguNIwuV6NuRgLBj2HvhFzFG.9ySt` | `video/mp4` | `1080 × 1920` (9:16 vertical) | `60.60 MB` | Streamed from the verified CloudFront/S3 URL using an `IntersectionObserver` (`rootMargin: 350px`) with `preload="metadata"` so it loads only when scrolled near the viewport. Clicking the circular video opens a vertical theater modal with audio, Play/Pause, progress bar, mute, and fullscreen controls. |

## Poster & Editorial Image Assets (Downloaded Locally)

| # | Section | Local Asset Path | Original Source URL | Format | Dimensions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Strategic Solutions (01 — Real-Time Brands) | `src/assets/images/solution-realtime-brands.webp` | `https://www.monks.com/data/styles/645x600_crop/s3/2025-06/Monks-Heinz-Mustard-RealTimeBrands.png.webp?VersionId=6V_ZoXipk5QXluLqtGT22mE7EOC6Ro2W&itok=53OaIHEd` | `image/webp` | `645 × 600` |
| 2 | Strategic Solutions (02 — Media Acceleration) | `src/assets/images/solution-media-acceleration.webp` | `https://www.monks.com/data/styles/645x600_crop/s3/2025-06/Monks-GlassBoxMedia-Hatch.png.webp?VersionId=Chaj0gFenyXD7qD8PQW8VsJepq3NnFah&itok=x3xEL2dz` | `image/webp` | `645 × 600` |
| 3 | Strategic Solutions (03 — Marketing Orchestration) | `src/assets/images/solution-marketing-orchestration.webp` | `https://www.monks.com/data/styles/645x600_crop/s3/2025-06/MarketingOrchestration-Monks-Main-2.png.webp?VersionId=AdvkR3zgn0iNbpIiLfemede.4PyVad4w&itok=3En04Z63` | `image/webp` | `645 × 600` |
| 4 | Strategic Solutions (04 — AI Transformation) | `src/assets/images/solution-ai-transformation.webp` | `https://www.monks.com/data/styles/645x600_crop/s3/2025-06/Monks-TechTransformation-main_0.png.webp?VersionId=HZsI12sKxHad5nJDTPQ8lrNg9rK_L3up&itok=TrTVhtiY` | `image/webp` | `645 × 600` |
| 5 | Our Agents (Monks.Flow Video Poster) | `src/assets/images/monks-flow-thumbnail.png` | `https://www.monks.com/data/2026-07/Monks-Flow%20Thumbnail.png?VersionId=RDN3A99CNZpmK0weJKGWkafUZyx0pw_H` | `image/png` | `1728 × 974` |
| 6 | Our Expertise (Boomtown Unboxed) | `src/assets/images/expertise-boomtown-unboxed.webp` | `https://www.monks.com/data/styles/997x600_crop/s3/2025-11/BoomtownUnboxed-Monks-mainhero.png.webp?VersionId=N2uXFs3uEqtvMKsiMrHyK9E64EFgngIa&itok=Y1YNk9wF` | `image/webp` | `997 × 600` |
| 7 | Our Expertise (AEO, GEO & AI Search Playbook) | `src/assets/images/expertise-aeo-geo.webp` | `https://www.monks.com/data/styles/412x412_crop/s3/2025-10/EO_APAC_hero.png.webp?VersionId=XB5c6rqFt2em_ZYG89fr4Tc3_XFMdf14&itok=b2G5fy4x` | `image/webp` | `412 × 412` |
| 8 | Our Expertise (CES 2026: From Vision to Velocity) | `src/assets/images/expertise-ces-2026.webp` | `https://www.monks.com/data/styles/645x600_crop/s3/2026-01/CES-2026-C-Space-Wes.jpg.webp?VersionId=7SGvd6GP7Zk3gVzyF4G5YV4BzdcGRgHm&itok=ieR55x4w` | `image/webp` | `645 × 600` |

## CDN & Accessibility Verification

- All listed URLs returned `HTTP/2 200` / `206 Partial Content` with `accept-ranges: bytes` via CloudFront (`www.monks.com/data/...`).
- No `<iframe>` video embeds (Vimeo/YouTube) are used on the reference homepage; all video playback runs via native HTML5 `<video>` elements.

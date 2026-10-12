# Mburoja e Muslimanit

Albanian prayer reader with Arabic text, transliteration, translation, references,
and audio. Includes 132 chapters, local fonts, themes, favourites, title search,
reading controls, and native audio with download and repeat.

[Website](https://mburoja.selmani.info) | [GitHub](https://github.com/abse/mburoja)

## Setup

Requires Node.js 22 or newer. Run commands from the project root.

### Linux / Windows

```bash
npm ci
npm run check
npm run preview:lan
```

On Windows, use `npm.cmd` instead of `npm` if PowerShell blocks `npm.ps1`.

Open the printed URL. LAN preview supports devices on the same network at port
4173; firewall rules and guest-network isolation may affect access. Use
npm run preview for localhost only. Stop with Ctrl+C.

## Structure

| Path | Purpose |
| --- | --- |
| v1/ | First initial Version |
| shared/chapters.json | Chapter content and audio references |
| shared/render.js | HTML template |
| shared/assets/ | Browser code, styles, logo, fonts, and licenses |
| shared/site.config.json | Metadata and canonical origin |
| scripts/ | Build, validation, preview, and release export |
| worker/worker.js | Cloudflare asset fallback |
| wrangler.jsonc | Cloudflare configuration |
| v2/ | Generated site for Cloudflare and standalone hosting |
| v2/audio/ | Authoritative MP3 recordings |
| audio-report.json | Recording availability |

Edit shared sources and rebuild. Do not edit generated HTML directly.
Builds preserve v2/audio/ and original recording filenames.

## Commands

| Command | Action |
| --- | --- |
| npm run build | Generate the site and audio report |
| npm run check | Build and validate content, links, SEO, and asset sizes |
| npm run preview | Build and preview on localhost |
| npm run preview:lan | Build and preview on the local network |
| npm run cf:dev | Run Wrangler locally |
| npm run cf:login | Sign in to Cloudflare |
| npm run cf:check | Validate and run a deployment dry run |
| npm run cf:deploy | Validate and deploy |
| npm run release:prepare | Export a clean release copy |

## Reading and recordings

Themes, fonts, favourites, text size, and line spacing persist in localStorage.
Preferences are specific to each browser and origin. Search matches chapter
titles without requiring accents. Text remains readable without JavaScript.

Arabic fonts: Hamdullah, Kitab Regular, Amiri, Noto Naskh, Abay (Emine), Lateef,
and System. Albanian fonts: System, Roboto, Poppins, Open Sans, Lato, Montserrat,
and Georgia. Fonts are hosted locally; see [font information](shared/FONT-REVIEW.md).

Audio does not autoplay and uses preload="none". Playback pauses other players.
Unavailable recordings show a message. There are 230 unique references and
225 available recordings. Missing: 18-11.mp3, 28-8.mp3, 51-2.mp3, 86-1.mp3,
and 89-1.mp3. See audio-report.json for current availability.

Local preview supports seeking. Cloudflare Static Assets currently returns full
MP3 responses, which prevent seeking in Chrome. Playback, download, and repeat
remain available. All site assets retain assets-first delivery.

## Hosting

Worker: mburoja. Custom Domain: mburoja.selmani.info. Cloudflare serves v2/ with
run_worker_first: false; matching files bypass Worker code. There is no database,
KV, R2, framework, or server-side rendering. Maximum asset size is 25 MiB.

```bash
npm run cf:login
npm run cf:check
npm run cf:deploy
```

For standalone hosting, upload v2/ contents and configure equivalent security
headers, cache rules, and a real 404 response. Cloudflare _headers and _redirects
are not generally interpreted by other servers. Assets use readable filenames
with cache revalidation; recordings use a one-day cache.

The canonical origin is https://mburoja.selmani.info, independent of hosting.
It controls canonical URLs, Open Graph URLs, sitemap entries, and the robots.txt
sitemap reference. An empty origin enables test-mode noindex.

Alternate hosts can serve the same files while retaining the canonical origin.
Configure DNS, the server's virtual host, and valid HTTPS for each hostname.

## Search engines

Sitemap: https://mburoja.selmani.info/sitemap.xml

robots.txt allows reading pages, excludes /audio/, and advertises the sitemap.
Submit the full sitemap URL through Google Search Console or Bing Webmaster
Tools using a verified property.

## Licenses

Keep bundled font licenses and notices with redistributed files. See
[font information](shared/FONT-REVIEW.md) and DIYANET-NOTICE.txt for details.
No repository-wide license is asserted for third-party text, translations,
recordings, or artwork.

Do not commit credentials or local environment files. Local agent guidance,
dependencies, Wrangler state, and logs are excluded from Git.

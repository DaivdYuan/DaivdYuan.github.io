# David D. Yuan — Production academic homepage

The production Site contains only the academic homepage: bio, news, research, publications, and contact. It has no widget code, visitor APIs, personal hobbies, development login, or development links.

Uses Jon Barron’s academic website template; original source and permission notice are retained in `templates/jon-barron/`.

All fonts and images are included locally. The homepage has no runtime JavaScript, API calls, cookies, login, or database requirement. The separate Sites preview may still impose its own account access policy; that policy is not part of this portable page.

## Edit and preview

Edit `public/index.html` for the bio, news, and publication entries. Update both the inline BibTeX and `public/assets/publications.bib` when adding a publication. Keep Jon Barron’s template credit and the font license. Original template files remain in `templates/jon-barron/`; the deployed stylesheet only changes font loading to local files.

Run `npm ci` once, then `npm run dev` for the Cloudflare-compatible local preview on port 4318. Run `npm run check` to check local links, assets, anchors, fonts, and the academic-only boundary. `npm run build` prepares `dist/` without contacting external services.

## GitHub Pages

The academic homepage is published at https://daivdyuan.github.io/ from the `academic-pages` branch of `DaivdYuan/DaivdYuan.github.io`, using `/docs` as the Pages source. The older blog remains preserved on `master`.

Edit `public/`, then run `npm run build:github` and commit both the edited source and generated `docs/` to `academic-pages`. GitHub Pages republishes that folder automatically. Only `docs/` is served; source files, development tooling, and template provenance are outside the web root. Building needs only Node.js; installing the development dependencies is only necessary for the Wrangler preview or Cloudflare commands.

`docs/.nojekyll` keeps the deployment as plain static files. The build adds the GitHub Pages canonical URL, sitemap, a 404 page, and a simple `/research/` redirect. GitHub Pages does not support Cloudflare's custom headers or redirects, so its package omits those files. The registered custom domain has not been configured; `site.config.json` currently identifies the GitHub Pages URL.

The initial publishing snapshot excludes local Sites identity, credentials, dependencies, and runtime state. Future content changes should be made on `academic-pages`, not on the archived blog branch.

## Deploy to Cloudflare later

This is a static-assets deployment, with no Worker handler or D1 binding. It does not require a paid backend plan for the academic page alone.

1. Set `url` in `site.config.json` to the final HTTPS domain once known. Leave it `null` during preparation; no placeholder canonical URL is published. The build generates the canonical link, Open Graph URL, sitemap, and sitemap entry in robots.txt when configured.
2. Run `npm ci`, then `npm run deploy:check` to validate the deployment locally.
3. Run `npx wrangler login` for your Cloudflare account, then `npm run deploy`.
4. Attach the registered domain in the Worker’s Settings → Domains & Routes → Add → Custom Domain. DNS must be active in your Cloudflare account. Keep any existing mail-related DNS records when moving DNS.

The checked-in configuration includes a real 404 page, the old `/research/` link redirect, and caching for versioned font files. The site code contains no credentials or Cloudflare account ID. Deployment requires your Cloudflare account; this repository alone does not provision or change DNS.

For Cloudflare Git builds: build command `npm run check && npm run build`, deploy command `npx wrangler deploy`. Keep the lockfile for repeatable tooling. For another static host, upload the contents of `dist/`; Cloudflare-specific `_headers` and `_redirects` may need that host’s equivalent settings.

Official references: [Static assets](https://developers.cloudflare.com/workers/static-assets/get-started/), [Custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Headers](https://developers.cloudflare.com/workers/static-assets/headers/).

## Relationship to development

The widgets and development source remain in `../david-worlds`. This checkout is the independent production homepage. Review any future content promotion rather than overwriting the production folder with the older development export script, which predates this standalone hosting configuration. Changes here do not publish the widget Lab.

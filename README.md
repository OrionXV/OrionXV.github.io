# Arsalaan's portfolio

Academic Pages / Jekyll portfolio at https://orionxv.github.io.

## Content

- `_pages/about.md`: homepage
- `_pages/research.md`: research areas and technical report
- `_portfolio/`: projects, ordered by the `order` field
- `_data/experience.yml`: work and research experience
- `_pages/cv.md`: education, tools, awards, and leadership
- `assets/css/sunset.css`: custom visual theme
- `legacy/`: the previous site, preserved with its original assets

## Preview

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open http://127.0.0.1:4000. Jekyll must build the site; opening source files directly using `file://` will not render the templates.

## Verify

```sh
bundle exec jekyll build --safe
node tests/site-check.mjs
```

GitHub Pages builds from `main` at the repository root. See `UPSTREAM.md` for the Academic Pages source and `ASSET-NOTES.md` for banner provenance.

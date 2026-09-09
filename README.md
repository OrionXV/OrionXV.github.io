# Arsalaan's portfolio

Academic Pages / Jekyll portfolio at https://orionxv.github.io.

## Content

- `_pages/about.md`: homepage
- `_pages/research.md`: research areas and technical report
- `_articles/`: Markdown writing; see publishing instructions below
- `_pages/copyright.md`: writing permissions and licence boundaries
- `_portfolio/`: projects, ordered by the `order` field
- `_data/experience.yml`: work and research experience
- `_pages/cv.md`: education, tools, awards, and leadership
- `assets/css/sunset.css`: custom visual theme
- `legacy/`: the previous site, preserved with its original assets

## Publish an article

1. Copy `_articles/template.md` to a new file in `_articles/`, for example `my-article.md`.
2. Change the title and publication date at the top. Paste your Markdown below the second `---` line; do not repeat the title as a `#` heading.
3. Change `published: false` to `published: true`.
4. Commit and push to `main`, or save the change in GitHub's editor. GitHub Pages rebuilds the site automatically.

The article appears at `/articles/my-article/` and is added to `/articles/`, newest first. No navigation or configuration edits are needed for each article. Keep the filename stable to preserve its link.

Optional fields above the second `---` line:

- `summary: "A short description"` replaces the first-paragraph excerpt on the Articles page.
- `copyright_year: 2024` uses an earlier original publication year in the article notice. Otherwise, the year comes from `date`.

`published: false` hides the rendered page, but **does not make the source private**: this GitHub repository is public. Keep confidential drafts outside this repository. Future dates alone do not hide articles; use `published: false` until ready.

For article images, add files under `images/articles/` and reference them as `![Description](/images/articles/filename.jpg)`. Only upload material you have permission to publish.

## Copyright

Original writing is reserved to Syed Arsalaan Nadim unless an article states otherwise. The template's MIT licence and third-party licences remain intact. See `_pages/copyright.md`. These are notices and permissions information, not a copyright registration.

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
bundle exec ruby tests/articles-check.rb
```

GitHub Pages builds from `main` at the repository root. See `UPSTREAM.md` for the Academic Pages source and `ASSET-NOTES.md` for banner provenance.

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
- `assets/css/disco.css`: alternate isometric harbour / paper theme
- `legacy/`: the previous site, preserved with its original assets

## Publish an article

1. Copy `_articles/template.md` to a new file in `_articles/`, for example `my-article.md`.
2. Change the title and publication date at the top. Paste your Markdown below the second `---` line; do not repeat the title as a `#` heading.
3. Change `published: false` to `published: true`.
4. Commit and push to `main`, or save the change in GitHub's editor. GitHub Pages rebuilds the site automatically.

The article appears at `/articles/my-article/` and is added to `/articles/`, newest first. No navigation or configuration edits are needed for each article. Keep the filename stable to preserve its link.

Optional fields above the second `---` line:

- `summary: "A short description"` replaces the first-paragraph excerpt on the Articles page.
- `category: Essay` adds a label to the listing and the article. Use `Poem`, `Notes`, or any label you like. Leave it out for no label.
- `image: /images/articles/my-picture.jpg` adds a thumbnail to the listing and the full picture above the writing. It also becomes the image used when sharing the article link. Local paths should begin with `/`; an `https://` image URL also works.
- `image_alt: "Description of the picture"` describes the image for readers using a screen reader. Use an empty string only for a decorative image.
- `image_caption: "Caption and image credit"` adds an optional plain-text caption beneath the full picture.
- `copyright_year: 2024` uses an earlier original publication year in the article notice. Otherwise, the year comes from `date`.

`published: false` hides the rendered page, but **does not make the source private**: this GitHub repository is public. Keep confidential drafts outside this repository. Future dates alone do not hide articles; use `published: false` until ready.

Add image files under `images/articles/`, then set `image` in the article's settings. To put additional pictures within your writing, use `![Description](/images/articles/filename.jpg)`. Only upload material you have permission to publish.

## Poems and paragraph breaks

For prose, leave a blank line between paragraphs. A single new line in Markdown does not start a new paragraph. The page title is already displayed, but you can repeat it in the body if you want.

For a poem, copy `_articles/poem-template.md`, keep `category: Poem`, and replace the sample text. This gives the poem a serif reading style and extra space between stanzas. Add `<br>` wherever you want a line break, and leave a blank line between stanzas:

```markdown
First line<br>
Second line

Next stanza<br>
Its final line
```

The category does not automatically insert line breaks; use the example above so they also survive the site's production formatting. Images, summaries, dates, and publishing work the same way as for essays. Both templates are unpublished until you copy them and set `published: true`.

## Copyright

Original writing is reserved to Syed Arsalaan Nadim unless an article states otherwise. The template's MIT licence and third-party licences remain intact. See `_pages/copyright.md`. These are notices and permissions information, not a copyright registration.

## Themes

The header's **Disco** switch changes between the original Sunset theme and the isometric harbour theme. Sunset is the default. The choice is saved in the visitor's browser under `arsalaan-theme`, restored before rendering, and shared across tabs. If browser storage is blocked, switching still works for the current page. Without JavaScript, Sunset and all navigation remain available.

Both themes use the same content and URLs. The archived `/legacy/` site is unchanged. The harbour illustration and generation prompt are documented in `ASSET-NOTES.md`.

## Preview

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open http://127.0.0.1:4000. Jekyll must build the site; opening source files directly using `file://` will not render the templates.

## Verify

```sh
JEKYLL_ENV=production bundle exec jekyll build --safe
node tests/site-check.mjs
node tests/theme-check.mjs --built
bundle exec ruby tests/articles-check.rb
```

GitHub Pages builds from `main` at the repository root. See `UPSTREAM.md` for the Academic Pages source and `ASSET-NOTES.md` for banner provenance.

Use the production build for verification: it compresses inline scripts, unlike the development preview. The theme checks exercise the compressed initialization on every main page.

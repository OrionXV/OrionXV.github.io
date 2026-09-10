require "jekyll"
require "tmpdir"
require "fileutils"

ROOT = File.expand_path("..", __dir__)

def check(condition, message)
  raise message unless condition
end

Dir.mktmpdir("portfolio-articles-check-") do |temporary|
  temporary = File.realpath(temporary)
  source = File.join(temporary, "source")
  destination = File.join(temporary, "site")
  FileUtils.mkdir_p(source)
  %w[_layouts _includes _sass assets images _data _pages].each do |directory|
    FileUtils.cp_r(File.join(ROOT, directory), source)
  end
  FileUtils.mkdir_p(File.join(source, "_articles"))
  Dir.glob(File.join(ROOT, "_articles/*template.md")).each do |template|
    FileUtils.cp(template, File.join(source, "_articles", File.basename(template)))
  end

  # Fixtures exist only in this disposable build, never in the public site.
  fixtures = {
    "a-older.md" => <<~MARKDOWN,
      ---
      title: "Older article"
      date: 2023-04-12
      copyright_year: 2021
      published: true
      ---

      Older writing.
    MARKDOWN
    "z-newer.md" => <<~MARKDOWN,
      ---
      title: "Newer article"
      date: 2025-07-21
      summary: "An **explicit** summary & details."
      category: 'Notes & "essays"'
      image: /images/sunset-street.jpg
      image_alt: 'A street & "sunset"'
      image_caption: 'Evening light & clouds. Credit: "Example".'
      published: true
      ---

      ## A section

      A **bold statement** and a [reference](https://example.com/).

      - First item
      - Second item

      ```python
      print("hello")
      ```
    MARKDOWN
    "poem.md" => <<~MARKDOWN,
      ---
      title: "Poem fixture"
      date: 2024-06-15
      category: Poem
      published: true
      ---

      First line<br>
      Second *line*

      Another stanza<br>
      Its final line
    MARKDOWN
    "empty-image.md" => <<~MARKDOWN,
      ---
      title: "Empty image fixture"
      date: 2022-01-01
      image: ""
      category: ""
      published: true
      ---

      No picture or category supplied.
    MARKDOWN
    "remote-image.md" => <<~MARKDOWN,
      ---
      title: "Remote image fixture"
      date: 2021-01-01
      image: https://example.com/photo.jpg
      published: true
      ---

      A remote picture with no caption.
    MARKDOWN
    "hidden-draft.md" => <<~MARKDOWN
      ---
      title: "Hidden draft fixture"
      date: 2026-01-01
      published: false
      ---

      This must not be published.
    MARKDOWN
  }
  fixtures.each do |name, content|
    File.write(File.join(source, "_articles", name), content)
  end

  configuration = Jekyll.configuration(
    "config" => File.join(ROOT, "_config.yml"),
    "source" => source,
    "destination" => destination,
    "safe" => true,
    "quiet" => true
  )
  Jekyll::Site.new(configuration).process

  listing = File.read(File.join(destination, "articles/index.html"))
  newer_position = listing.index('href="/articles/z-newer/"')
  older_position = listing.index('href="/articles/a-older/"')
  check(newer_position && older_position && newer_position < older_position,
        "Articles must be ordered newest first, not by filename")
  check(listing.include?("An explicit summary &amp; details."), "Article summary text or escaping is incorrect")
  check(!listing.include?("Hidden draft fixture"), "Draft appeared in the article list")

  %w[hidden-draft template poem-template].each do |slug|
    check(!File.exist?(File.join(destination, "articles", slug)), "Draft output exists: #{slug}")
    sitemap = File.read(File.join(destination, "sitemap.xml"))
    check(!sitemap.include?("/articles/#{slug}/"), "Draft leaked into the sitemap: #{slug}")
  end

  newer = File.read(File.join(destination, "articles/z-newer/index.html"))
  older = File.read(File.join(destination, "articles/a-older/index.html"))
  check(newer.include?('<h2 id="a-section">A section</h2>'), "Markdown heading was not rendered")
  check(newer.include?("<strong>bold statement</strong>"), "Markdown emphasis was not rendered")
  check(newer.include?('<a href="https://example.com/">reference</a>'), "Markdown link was not rendered")
  check(newer.include?("<li>First item</li>"), "Markdown list was not rendered")
  check(newer.include?("language-python") && newer.include?("<code>"), "Fenced code was not rendered")
  check(newer.scan(/<h1[ >]/).length == 1, "An article must have exactly one page title")
  check(newer.include?('href="/articles/" aria-current="page"'), "Articles navigation is not active")
  check(newer.include?("July 21, 2025"), "Article date is missing")
  check(newer.include?("© 2025 Syed Arsalaan Nadim. All rights reserved."), "Publication-year copyright is missing")
  check(older.include?("© 2021 Syed Arsalaan Nadim. All rights reserved."), "Copyright year override was ignored")
  check(newer.include?("Copyright &amp; permissions"), "Copyright link is missing")
  check(newer.include?("← All articles"), "Article return link is missing")

  [listing, newer].each do |html|
    check(html.include?('<span class="article-category">Notes &amp; &quot;essays&quot;</span>'), "Category must appear and be escaped on both pages")
    check(html.match?(/<img[^>]+src="\/images\/sunset-street.jpg"[^>]+alt="A street &amp; &quot;sunset&quot;"/), "Article picture or alt text is missing")
  end
  check(newer.include?('<figcaption>Evening light &amp; clouds. Credit: &quot;Example&quot;.</figcaption>'), "Image caption is missing or unescaped")
  check(newer.include?('property="og:image" content="https://orionxv.github.io/images/sunset-street.jpg"'), "Article sharing image is incorrect")
  check(!older.include?('class="article-figure"') && !older.include?('class="article-category"'), "Optional fields must not create empty elements")
  empty_image = File.read(File.join(destination, "articles/empty-image/index.html"))
  check(!empty_image.include?('class="article-figure"') && !empty_image.include?('class="article-category"'), "Blank fields must not create empty elements")
  remote = File.read(File.join(destination, "articles/remote-image/index.html"))
  check(remote.include?('src="https://example.com/photo.jpg" alt=""'), "Remote image URL or decorative alt fallback is incorrect")
  check(!remote.include?("<figcaption>"), "Missing caption must not create an empty caption")
  poem = File.read(File.join(destination, "articles/poem/index.html"))
  check(poem.include?('class="article-body article-body--poem"'), "Poem reading style was not applied")
  check(poem.match?(/First line<br\s*\/?>\s*Second <em>line<\/em>/), "Poem line breaks and emphasis must survive production compression")
  check(poem.match?(/<p>Another stanza<br\s*\/?>\s*Its final line<\/p>/), "Poem stanza break was lost")
  check(listing.include?('<span class="article-category">Poem</span>'), "Poem category must appear in the listing")
  check(!newer.include?('article-body--poem'), "Prose must not receive poem styling")

  # Local image paths must also work when hosted beneath a project prefix.
  Jekyll::Site.new(configuration.merge("baseurl" => "/preview")).process
  prefixed = File.read(File.join(destination, "articles/z-newer/index.html"))
  check(prefixed.include?('src="/preview/images/sunset-street.jpg"'), "Local image ignored the site prefix")
  check(prefixed.include?('property="og:image" content="https://orionxv.github.io/preview/images/sunset-street.jpg"'), "Sharing image ignored the site prefix")
  prefixed_remote = File.read(File.join(destination, "articles/remote-image/index.html"))
  check(prefixed_remote.include?('src="https://example.com/photo.jpg"'), "Remote image must not receive a site prefix")
  Jekyll::Site.new(configuration).process

  if ARGV.include?("--preview")
    preview = Dir.mktmpdir("portfolio-articles-preview-")
    FileUtils.cp_r(destination, File.join(preview, "site"))
    puts "Disposable preview: #{File.join(preview, 'site')}"
  end

  # Also exercise the empty state after removing our published fixtures.
  %w[a-older.md z-newer.md poem.md empty-image.md remote-image.md].each do |name|
    File.delete(File.join(source, "_articles", name))
  end
  Jekyll::Site.new(configuration).process
  listing = File.read(File.join(destination, "articles/index.html"))
  check(listing.include?("No articles published yet."), "Empty state is missing")
end

puts "PASS: Markdown, images, captions, categories, poems, site prefixes, article order, drafts, navigation, dates, copyright, and empty state."

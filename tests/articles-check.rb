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
  FileUtils.cp(File.join(ROOT, "_articles/template.md"), File.join(source, "_articles/template.md"))

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

  %w[hidden-draft template].each do |slug|
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

  if ARGV.include?("--preview")
    preview = Dir.mktmpdir("portfolio-articles-preview-")
    FileUtils.cp_r(destination, File.join(preview, "site"))
    puts "Disposable preview: #{File.join(preview, 'site')}"
  end

  # Also exercise the empty state after removing our published fixtures.
  %w[a-older.md z-newer.md].each do |name|
    File.delete(File.join(source, "_articles", name))
  end
  Jekyll::Site.new(configuration).process
  listing = File.read(File.join(destination, "articles/index.html"))
  check(listing.include?("No articles published yet."), "Empty state is missing")
end

puts "PASS: Markdown rendering, article order, draft exclusion, navigation, dates, copyright, and empty state."

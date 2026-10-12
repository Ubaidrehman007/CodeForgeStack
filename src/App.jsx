import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const STORAGE_KEY = "codeforge-articles";

const categories = [
  "Java",
  "React",
  "Spring Boot",
  "Database",
  "Web Development",
  "DevOps",
  "AI & Machine Learning",
  "Other",
];

const starterArticles = [
  {
    id: "java-collections",
    title: "Java Collections Framework: A Complete Guide",
    description:
      "Understand List, Set, Map and the essential collection classes every Java developer should know.",
    category: "Java",
    author: "CodeForge Team",
    date: "2026-10-12",
    readTime: "8 min read",
    views: 980,
    status: "published",
    seoTitle: "Java Collections Framework: Complete Guide",
    seoDescription:
      "Learn Java List, Set, Map, ArrayList, HashSet and HashMap with practical explanations.",
    content:
      "The Java Collections Framework provides reusable interfaces and implementations to store and manipulate groups of objects.\n\n## Understand the main interfaces\n\nList maintains an ordered collection, Set stores unique elements, Queue supports sequential processing, and Map stores key-value pairs.\n\n## Choose the right collection\n\nUse ArrayList for indexed access, HashSet for uniqueness and HashMap for key-value lookups. Choose collections based on your application's requirements.",
  },
  {
    id: "react-components-state",
    title: "React Components and State Explained",
    description:
      "Learn how reusable components, props and state work together in interactive applications.",
    category: "React",
    author: "CodeForge Team",
    date: "2026-10-11",
    readTime: "6 min read",
    views: 1250,
    status: "published",
    seoTitle: "React Components and State Explained",
    seoDescription:
      "Understand React components, props, state and event handlers in this beginner-friendly guide.",
    content:
      "React components are reusable building blocks of a user interface.\n\n## Props and state\n\nProps pass data between components. State stores information that can change as users interact with an application.\n\n## Build interactive interfaces\n\nUse event handlers and state updates to build interactive interfaces. Keep components focused, reusable and easy to maintain.",
  },
  {
    id: "spring-boot-rest-api",
    title: "Build REST APIs with Spring Boot",
    description:
      "Explore controllers, services, repositories and maintainable Java API architecture.",
    category: "Spring Boot",
    author: "CodeForge Team",
    date: "2026-10-10",
    readTime: "10 min read",
    views: 1560,
    status: "published",
    seoTitle: "Build REST APIs with Spring Boot",
    seoDescription:
      "Learn controllers, services, repositories, HTTP methods and REST API best practices in Spring Boot.",
    content:
      "A REST API exposes resources through HTTP endpoints. Clients can use GET, POST, PUT, PATCH and DELETE to interact with those resources.\n\n## Layered architecture\n\nIn Spring Boot, controllers handle HTTP requests, services contain business logic and repositories manage data access.\n\n## Build reliable APIs\n\nValidate input, return appropriate status codes and handle exceptions consistently to build reliable APIs.",
  },
  {
    id: "sql-database-basics",
    title: "SQL and Database Fundamentals",
    description:
      "Learn tables, relationships, joins and queries for relational databases.",
    category: "Database",
    author: "CodeForge Team",
    date: "2026-10-09",
    readTime: "7 min read",
    views: 740,
    status: "published",
    seoTitle: "SQL and Database Fundamentals",
    seoDescription:
      "Learn SQL queries, joins, primary keys, foreign keys, indexes and relational database basics.",
    content:
      "Relational databases organize structured data into tables. Primary keys identify records, while foreign keys connect related tables.\n\n## Essential SQL commands\n\nSELECT retrieves data, WHERE filters records, JOIN combines tables and GROUP BY supports aggregation.\n\nGood data types, constraints, indexes and transactions help keep data consistent.",
  },
  {
    id: "web-development-roadmap",
    title: "A Practical Web Development Roadmap",
    description:
      "A learning path covering HTML, CSS, JavaScript, frontend frameworks and backend development.",
    category: "Web Development",
    author: "CodeForge Team",
    date: "2026-10-08",
    readTime: "5 min read",
    views: 1100,
    status: "published",
    seoTitle: "Web Development Roadmap for Beginners",
    seoDescription:
      "Explore a practical web development learning path from HTML and CSS to backend APIs and deployment.",
    content:
      "Learn semantic HTML, responsive CSS and JavaScript fundamentals. Build small projects instead of relying only on tutorials.\n\nChoose a frontend framework and learn how HTTP APIs connect it to a backend. Practice authentication, database operations and validation.\n\nUse Git, write tests, document your work and deploy projects to demonstrate practical skills.",
  },
];

function makeSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function countWords(value = "") {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function estimateReadTime(value = "") {
  return `${Math.max(1, Math.ceil(countWords(value) / 200))} min read`;
}

function readArticles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterArticles;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : starterArticles;
  } catch {
    return starterArticles;
  }
}

/* A small safe text renderer for headings, paragraphs and fenced code.
   Raw HTML is never injected into the page. */
function ArticleContent({ content = "" }) {
  const lines = content.split("\n");
  const blocks = [];
  let paragraph = [];
  let codeLines = [];
  let inCode = false;

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({
        type: "paragraph",
        text: paragraph.join(" "),
      });
      paragraph = [];
    }
  }

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: codeLines.join("\n") });
        codeLines = [];
        inCode = false;
      } else {
        flushParagraph();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({
        type: `h${heading[1].length}`,
        text: heading[2],
      });
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();

  if (inCode) {
    blocks.push({ type: "code", text: codeLines.join("\n") });
  }

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <pre className="article-code" key={index}>
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.type === "h1") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;

        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="CodeForge Stack home">
          <span className="brand-mark">&lt;/&gt;</span>
          <span>
            CodeForge<span className="brand-accent">Stack</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/#articles">Articles</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <Link className="nav-cta" to="/admin/new">
          Write a blog ↗
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Link className="brand footer-brand" to="/">
        <span className="brand-mark">&lt;/&gt;</span>
        <span>
          CodeForge<span className="brand-accent">Stack</span>
        </span>
      </Link>
      <p>Built for developers who love to learn and build.</p>
      <span className="footer-copy">
        © {new Date().getFullYear()} CodeForge Stack
      </span>
    </footer>
  );
}

function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <div className="card-topline">
        <span className="category-badge">{article.category}</span>
        <span className="read-time">{article.readTime}</span>
      </div>

      <Link className="card-title" to={`/articles/${article.id}`}>
        {article.title}
      </Link>

      <p className="card-description">{article.description}</p>

      <div className="card-meta">
        <span>{article.author}</span>
        <time dateTime={article.date}>{article.date}</time>
      </div>

      <Link className="read-link" to={`/articles/${article.id}`}>
        Read article ↗
      </Link>
    </article>
  );
}

function HomePage({ articles }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");

  const visibleArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles
      .filter((article) => article.status === "published")
      .filter((article) => category === "All" || article.category === category)
      .filter((article) =>
        [article.title, article.description, article.category, article.content]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .sort((a, b) => {
        if (sort === "popular") return (b.views || 0) - (a.views || 0);
        if (sort === "oldest") return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [articles, search, category, sort]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setSort("latest");
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" /> A BLOG FOR BUILDERS
          </div>

          <h1>
            Ideas into code.
            <br />
            <span>Code into impact.</span>
          </h1>

          <p className="hero-description">
            Practical tutorials, engineering insights and developer guides to
            help you build better software, one line at a time.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#articles">
              Explore articles ↓
            </a>
            <Link className="button-secondary" to="/admin/new">
              Write a blog
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>
                {articles.filter((a) => a.status === "published").length}
              </strong>
              <span>Published articles</span>
            </div>
            <div className="stat-divider" />
            <div>
              <strong>{categories.length}</strong>
              <span>Tech categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="articles-section section-container" id="articles">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE KNOWLEDGE HUB</span>
            <h2>
              Explore articles<span className="heading-dot">.</span>
            </h2>
            <p>Find practical knowledge for your next build.</p>
          </div>
          <span className="article-count">
            {visibleArticles.length} articles
          </span>
        </div>

        <div className="discovery-panel">
          <label className="search-box">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search blogs and topics..."
              aria-label="Search blogs"
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                type="button"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className="sort-control">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort articles"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most popular</option>
            </select>
          </label>
        </div>

        <div className="category-filters" aria-label="Filter by category">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-chip ${category === item ? "active" : ""}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {visibleArticles.length ? (
          <div className="articles-grid">
            {visibleArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No articles found</h3>
            <p>Try a different keyword or category.</p>
            <button
              className="button-primary"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="topics-section" id="topics">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">PICK YOUR STACK</span>
              <h2>
                Browse by topic<span className="heading-dot">.</span>
              </h2>
            </div>
          </div>

          <div className="topics-grid">
            {categories.map((item, index) => (
              <a
                className="topic-card"
                key={item}
                href="#articles"
                onClick={() => setCategory(item)}
              >
                <span className="topic-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="topic-name">{item}</span>
                <span className="topic-count">
                  {
                    articles.filter(
                      (a) => a.category === item && a.status === "published",
                    ).length
                  }{" "}
                  articles
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function getHeadingId(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function ArticlePage({ articles }) {
  const { articleId } = useParams();
  const [progress, setProgress] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");

  const article = articles.find(
    (item) => item.id === articleId && item.status === "published",
  );

  const lines = (article?.content || "").split("\n");

  const headings = lines
    .filter((line) => /^#{1,3}\s+/.test(line.trim()))
    .map((line) => {
      const match = line.trim().match(/^(#{1,3})\s+(.+)$/);
      return {
        level: match[1].length,
        text: match[2].trim(),
        id: getHeadingId(match[2]),
      };
    });

  useEffect(() => {
    function updateProgress() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const next = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, next)));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [articleId]);

  async function copyCode(code, key) {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus(key);
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("");
      window.alert("Copy failed. Please select and copy the code manually.");
    }
  }

  if (!article) {
    return (
      <main className="not-found">
        <h1>Article not found.</h1>
        <Link className="button-primary" to="/">
          Back home
        </Link>
      </main>
    );
  }

  const contentBlocks = [];
  let paragraphLines = [];
  let codeLines = [];
  let insideCode = false;
  let codeLanguage = "";
  let codeIndex = 0;

  function flushParagraph() {
    if (paragraphLines.length) {
      contentBlocks.push({
        type: "paragraph",
        text: paragraphLines.join(" "),
      });
      paragraphLines = [];
    }
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      flushParagraph();

      if (!insideCode) {
        insideCode = true;
        codeLanguage = line.slice(3).trim() || "code";
        codeLines = [];
      } else {
        contentBlocks.push({
          type: "code",
          language: codeLanguage,
          code: codeLines.join("\n"),
          key: `code-${codeIndex++}`,
        });
        insideCode = false;
      }

      return;
    }

    if (insideCode) {
      codeLines.push(rawLine);
      return;
    }

    if (!line) {
      flushParagraph();
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();
      contentBlocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
        id: getHeadingId(headingMatch[2]),
      });
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      contentBlocks.push({
        type: "list-item",
        text: line.replace(/^[-*]\s+/, ""),
      });
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      contentBlocks.push({
        type: "ordered-item",
        text: line.replace(/^\d+\.\s+/, ""),
      });
      return;
    }

    paragraphLines.push(line);
  });

  if (insideCode) {
    contentBlocks.push({
      type: "code",
      language: codeLanguage,
      code: codeLines.join("\n"),
      key: `code-${codeIndex++}`,
    });
  }

  flushParagraph();

  const renderedBlocks = [];
  let listItems = [];
  let orderedItems = [];

  function flushLists() {
    if (listItems.length) {
      renderedBlocks.push(
        <ul key={`ul-${renderedBlocks.length}`}>
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }

    if (orderedItems.length) {
      renderedBlocks.push(
        <ol key={`ol-${renderedBlocks.length}`}>
          {orderedItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>,
      );
      orderedItems = [];
    }
  }

  contentBlocks.forEach((block) => {
    if (block.type === "list-item") {
      if (orderedItems.length) flushLists();
      listItems.push(block.text);
      return;
    }

    if (block.type === "ordered-item") {
      if (listItems.length) flushLists();
      orderedItems.push(block.text);
      return;
    }

    flushLists();

    if (block.type === "heading") {
      const HeadingTag = `h${block.level}`;

      renderedBlocks.push(
        <HeadingTag id={block.id} key={block.id}>
          {block.text}
        </HeadingTag>,
      );
    } else if (block.type === "paragraph") {
      renderedBlocks.push(
        <p key={`p-${renderedBlocks.length}`}>{block.text}</p>,
      );
    } else if (block.type === "code") {
      renderedBlocks.push(
        <div className="article-code-block" key={block.key}>
          <div className="article-code-toolbar">
            <span>{block.language}</span>
            <button
              type="button"
              onClick={() => copyCode(block.code, block.key)}
              aria-label="Copy code example"
            >
              {copyStatus === block.key ? "Copied ✓" : "Copy code"}
            </button>
          </div>
          <pre>
            <code>{block.code}</code>
          </pre>
        </div>,
      );
    }
  });

  flushLists();

  return (
    <>
      <div
        className="article-reading-progress"
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <main className="article-page article-page-enhanced">
        <Link className="back-link" to="/#articles">
          ← Back to articles
        </Link>

        <header className="article-header">
          <span className="category-badge">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="article-intro">{article.description}</p>

          <div className="article-meta">
            <span>{article.author}</span>
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        <div className="article-reading-layout">
          {headings.length > 0 && (
            <aside className="article-toc">
              <h2>On this page</h2>
              <nav aria-label="Table of contents">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    className={`toc-level-${heading.level}`}
                    href={`#${heading.id}`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          <article className="article-body article-body-enhanced">
            {renderedBlocks}
          </article>
        </div>

        <div className="article-end-note">
          <span className="brand-mark">&lt;/&gt;</span>
          <p>You’ve reached the end. Keep learning, building, and sharing.</p>
          <Link to="/#articles">Explore more articles ↗</Link>
        </div>
      </main>
    </>
  );
}

function AdminLayout({ articles }) {
  const navigate = useNavigate();
  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;

  function deleteArticle(id) {
    const confirmed = window.confirm(
      "Delete this blog permanently from this browser?",
    );
    if (!confirmed) return;

    window.dispatchEvent(
      new CustomEvent("codeforge-delete-article", { detail: id }),
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">CONTENT MANAGEMENT</span>
          <h1>
            Admin Dashboard<span className="heading-dot">.</span>
          </h1>
          <p>Manage your CodeForge Stack articles.</p>
        </div>
        <Link className="button-primary" to="/admin/new">
          ＋ Write new blog
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Total blogs</span>
          <strong>{articles.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Published</span>
          <strong>{published}</strong>
        </div>
        <div className="admin-stat">
          <span>Drafts</span>
          <strong>{drafts}</strong>
        </div>
      </div>

      <div className="admin-list-heading">
        <h2>Your blogs</h2>
        <span>{articles.length} total</span>
      </div>

      <div className="admin-table-wrap">
        {articles.length === 0 ? (
          <div className="empty-state">
            <h3>No blogs yet</h3>
            <Link className="button-primary" to="/admin/new">
              Create your first blog
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                    <small>/{article.id}</small>
                  </td>
                  <td>{article.category}</td>
                  <td>
                    <span className={`status-pill ${article.status}`}>
                      {article.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/edit/${article.id}`)}
                      >
                        Edit
                      </button>
                      {article.status === "published" && (
                        <Link to={`/articles/${article.id}`}>View</Link>
                      )}
                      <button
                        className="delete-action"
                        type="button"
                        onClick={() => deleteArticle(article.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="admin-warning">
        Prototype mode: articles are stored in this browser only. This dashboard
        is not protected by authentication yet.
      </p>
    </main>
  );
}

function BlogEditor({ articles, saveArticle }) {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const existing = articleId
    ? articles.find((article) => article.id === articleId)
    : null;

  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    slug: existing?.id ?? "",
    description: existing?.description ?? "",
    category: existing?.category ?? "Java",
    content: existing?.content ?? "",
    seoTitle: existing?.seoTitle ?? "",
    seoDescription: existing?.seoDescription ?? "",
  }));

  const [slugEdited, setSlugEdited] = useState(Boolean(existing));
  const [mode, setMode] = useState("write");
  const [message, setMessage] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(form));

  const wordCount = countWords(form.content);
  const isDirty = JSON.stringify(form) !== savedSnapshot;

  useEffect(() => {
    function warnBeforeUnload(event) {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  function update(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "title" && !slugEdited ? { slug: makeSlug(value) } : {}),
      ...(field === "title" && !previous.seoTitle
        ? { seoTitle: value.slice(0, 60) }
        : {}),
      ...(field === "description" && !previous.seoDescription
        ? { seoDescription: value.slice(0, 160) }
        : {}),
    }));
    setMessage("");
  }

  function leaveEditor() {
    if (isDirty && !window.confirm("Discard your unsaved changes?")) return;
    navigate("/admin");
  }

  function submit(status) {
    const title = form.title.trim();
    const description = form.description.trim();
    const content = form.content.trim();
    const id = makeSlug(form.slug || title);

    if (!title || !description || !content) {
      setMessage("Please complete the title, description and article content.");
      return;
    }

    if (!id) {
      setMessage("Please enter a valid URL slug using letters or numbers.");
      return;
    }

    const collision = articles.some(
      (article) => article.id === id && article.id !== existing?.id,
    );

    if (collision) {
      setMessage("This URL slug already exists. Choose a different slug.");
      return;
    }

    const article = {
      id,
      title,
      description,
      category: form.category,
      content,
      author: existing?.author || "CodeForge Author",
      date: new Date().toISOString().slice(0, 10),
      readTime: estimateReadTime(content),
      views: existing?.views || 0,
      status,
      seoTitle: (form.seoTitle.trim() || title).slice(0, 70),
      seoDescription: (form.seoDescription.trim() || description).slice(0, 160),
    };

    saveArticle(article);
    setSavedSnapshot(JSON.stringify(form));
    navigate("/admin");
  }

  return (
    <main className="editor-page editor-page-wide">
      <button
        type="button"
        className="back-link editor-back-button"
        onClick={leaveEditor}
      >
        ← Back to dashboard
      </button>

      <div className="admin-heading">
        <div>
          <span className="section-kicker">CONTENT WORKSPACE</span>
          <h1>
            {existing ? "Edit blog" : "Write a blog"}
            <span className="heading-dot">.</span>
          </h1>
          <p>Create a useful article for the developer community.</p>
        </div>
        <span className={`editor-save-indicator ${isDirty ? "unsaved" : ""}`}>
          <span className="status-dot" />
          {isDirty ? "Unsaved changes" : "Ready to edit"}
        </span>
      </div>

      <form
        className="blog-form editor-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="editor-field-grid">
          <label>
            Blog title <span>*</span>
            <input
              required
              maxLength={150}
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Getting started with Spring Boot"
            />
            <small>{form.title.length}/150 characters</small>
          </label>

          <label>
            Category
            <select
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          URL slug <span>*</span>
          <input
            required
            maxLength={100}
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              update("slug", makeSlug(event.target.value));
            }}
            placeholder="getting-started-with-spring-boot"
          />
          <small>
            Preview URL: /articles/
            {makeSlug(form.slug || form.title) || "your-blog-slug"}
          </small>
        </label>

        <label>
          Short description <span>*</span>
          <textarea
            required
            rows={3}
            maxLength={300}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Explain what readers will learn from this article..."
          />
          <small>{form.description.length}/300 characters</small>
        </label>

        <div className="editor-divider" />

        <div className="editor-section-heading">
          <div>
            <h2>Article content</h2>
            <p>Use Markdown-style headings and fenced code blocks.</p>
          </div>
          <span>
            {wordCount} words · {estimateReadTime(form.content)}
          </span>
        </div>

        <div
          className="editor-mode-tabs"
          role="tablist"
          aria-label="Editor view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "write"}
            className={mode === "write" ? "active" : ""}
            onClick={() => setMode("write")}
          >
            Write
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "preview"}
            className={mode === "preview" ? "active" : ""}
            onClick={() => setMode("preview")}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "split"}
            className={mode === "split" ? "active" : ""}
            onClick={() => setMode("split")}
          >
            Split view
          </button>
        </div>

        <div className={`editor-workspace mode-${mode}`}>
          {mode !== "preview" && (
            <label className="editor-content-field">
              Write your article <span>*</span>
              <textarea
                className="blog-content-input"
                required
                rows={20}
                value={form.content}
                onChange={(event) => update("content", event.target.value)}
                placeholder={
                  'Start writing here...\n\n## Your first heading\n\nExplain the concept with examples.\n\n```java\nSystem.out.println("Hello, world!");\n```'
                }
              />
              <small>
                Tip: use ## Heading, ### Subheading and triple backticks for
                code.
              </small>
            </label>
          )}

          {mode !== "write" && (
            <section className="editor-preview" aria-label="Article preview">
              <span className="section-kicker">LIVE PREVIEW</span>
              <h2>{form.title || "Your article title"}</h2>
              <p className="article-intro">
                {form.description ||
                  "Your article description will appear here."}
              </p>
              <div className="article-meta">
                <span>{existing?.author || "CodeForge Author"}</span>
                <span>{estimateReadTime(form.content)}</span>
              </div>
              {form.content.trim() ? (
                <ArticleContent content={form.content} />
              ) : (
                <p>
                  Your article content preview will appear here as you type.
                </p>
              )}
            </section>
          )}
        </div>

        <div className="editor-divider" />

        <div className="editor-section-heading">
          <div>
            <h2>SEO settings</h2>
            <p>Set the search title and summary for this article.</p>
          </div>
        </div>

        <label>
          SEO title
          <input
            maxLength={70}
            value={form.seoTitle}
            onChange={(event) => update("seoTitle", event.target.value)}
            placeholder="A clear title for search results"
          />
          <small>{form.seoTitle.length}/70 characters</small>
        </label>

        <label>
          Meta description
          <textarea
            rows={3}
            maxLength={160}
            value={form.seoDescription}
            onChange={(event) => update("seoDescription", event.target.value)}
            placeholder="A concise summary that explains why the article is useful."
          />
          <small>{form.seoDescription.length}/160 characters</small>
        </label>

        <div className="seo-search-preview">
          <span>SEARCH RESULT PREVIEW</span>
          <strong>{form.seoTitle || form.title || "Article title"}</strong>
          <small>
            codeforgestack.local/articles/
            {makeSlug(form.slug || form.title) || "your-blog-slug"}
          </small>
          <p>
            {form.seoDescription ||
              form.description ||
              "Your article description will appear here."}
          </p>
        </div>

        {message && (
          <p className="editor-message" role="alert">
            {message}
          </p>
        )}

        <div className="editor-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={leaveEditor}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => submit("draft")}
          >
            Save draft
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={() => submit("published")}
          >
            {existing?.status === "published"
              ? "Update & publish"
              : "Publish blog"}{" "}
            ↗
          </button>
        </div>
      </form>
    </main>
  );
}

function AppContent() {
  const [articles, setArticles] = useState(readArticles);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch {
      console.error(
        "CodeForge Stack could not save articles to local storage.",
      );
    }
  }, [articles]);

  useEffect(() => {
    function handleDelete(event) {
      setArticles((current) =>
        current.filter((article) => article.id !== event.detail),
      );
    }

    window.addEventListener("codeforge-delete-article", handleDelete);
    return () =>
      window.removeEventListener("codeforge-delete-article", handleDelete);
  }, []);

  function saveArticle(article) {
    setArticles((current) => {
      const exists = current.some((item) => item.id === article.id);

      if (exists) {
        return current.map((item) => (item.id === article.id ? article : item));
      }

      return [article, ...current];
    });
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage articles={articles} />} />
        <Route
          path="/articles/:articleId"
          element={<ArticlePage articles={articles} />}
        />
        <Route path="/admin" element={<AdminLayout articles={articles} />} />
        <Route
          path="/admin/new"
          element={<BlogEditor articles={articles} saveArticle={saveArticle} />}
        />
        <Route
          path="/admin/edit/:articleId"
          element={<BlogEditor articles={articles} saveArticle={saveArticle} />}
        />
        <Route
          path="*"
          element={
            <main className="not-found">
              <h1>Page not found.</h1>
              <p>The page you requested does not exist.</p>
              <Link className="button-primary" to="/">
                Back home
              </Link>
            </main>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

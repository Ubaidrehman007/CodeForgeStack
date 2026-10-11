import { useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import "./App.css";

const articles = [
  {
    id: "java-collections",
    title: "Java Collections Framework: A Complete Guide",
    description:
      "Understand List, Set, Map, Queue and the essential collection classes every Java developer should know.",
    category: "Java",
    author: "CodeForge Team",
    date: "2026-10-12",
    readTime: "8 min read",
    views: 980,
    tag: "Core Java",
    content: [
      {
        heading: "What is the Java Collections Framework?",
        text: "The Java Collections Framework provides interfaces and implementations to store, organize and manipulate groups of objects. It helps developers write reusable and maintainable code.",
      },
      {
        heading: "Important collection interfaces",
        text: "List maintains an ordered collection, Set stores unique elements, Queue supports processing elements in sequence, and Map stores key-value pairs.",
      },
      {
        heading: "Which collection should you use?",
        text: "Use ArrayList for general-purpose indexed access, HashSet for uniqueness, HashMap for key-value lookups, and ArrayDeque for many queue and stack operations. Choose based on your requirements.",
      },
    ],
  },
  {
    id: "react-components-state",
    title: "React Components and State Explained",
    description:
      "Learn how reusable components, props and state work together to build interactive React applications.",
    category: "React",
    author: "CodeForge Team",
    date: "2026-10-11",
    readTime: "6 min read",
    views: 1250,
    tag: "Frontend",
    content: [
      {
        heading: "Understanding components",
        text: "React components are reusable building blocks of a user interface. A component can accept data through props and return the UI that React should render.",
      },
      {
        heading: "Props versus state",
        text: "Props are passed into a component by its parent. State represents data managed by a component and can change in response to user interactions.",
      },
      {
        heading: "Build interactive interfaces",
        text: "Use event handlers and state updates to respond to clicks, forms and other user actions. Keep components focused and reusable as your application grows.",
      },
    ],
  },
  {
    id: "spring-boot-rest-api",
    title: "Build REST APIs with Spring Boot",
    description:
      "Explore controllers, services, repositories and the layered architecture behind maintainable Java APIs.",
    category: "Spring Boot",
    author: "CodeForge Team",
    date: "2026-10-10",
    readTime: "10 min read",
    views: 1560,
    tag: "Backend",
    content: [
      {
        heading: "What is a REST API?",
        text: "A REST API exposes resources through HTTP endpoints. Clients can use methods such as GET, POST, PUT, PATCH and DELETE to interact with those resources.",
      },
      {
        heading: "Structure your Spring Boot application",
        text: "Controllers handle HTTP requests, services contain business logic, and repositories handle data access. DTOs help define the shape of API requests and responses.",
      },
      {
        heading: "Build reliable endpoints",
        text: "Validate incoming data, return appropriate HTTP status codes, handle exceptions consistently and protect endpoints that require authentication.",
      },
    ],
  },
  {
    id: "sql-database-basics",
    title: "SQL and Database Fundamentals for Developers",
    description:
      "Learn tables, relationships, joins and queries that help you work confidently with relational databases.",
    category: "Database",
    author: "CodeForge Team",
    date: "2026-10-09",
    readTime: "7 min read",
    views: 740,
    tag: "SQL",
    content: [
      {
        heading: "How relational databases work",
        text: "Relational databases organize structured data into tables containing rows and columns. Primary keys identify records, while foreign keys connect related tables.",
      },
      {
        heading: "Write useful SQL queries",
        text: "SELECT retrieves data, WHERE filters records, JOIN combines related tables, and GROUP BY supports aggregation. Practice queries using realistic datasets.",
      },
      {
        heading: "Keep your data consistent",
        text: "Use suitable data types, constraints, indexes and transactions. Good database design improves reliability and makes applications easier to maintain.",
      },
    ],
  },
  {
    id: "web-development-roadmap",
    title: "A Practical Web Development Learning Roadmap",
    description:
      "A structured learning path covering HTML, CSS, JavaScript, frontend frameworks and backend fundamentals.",
    category: "Web Development",
    author: "CodeForge Team",
    date: "2026-10-08",
    readTime: "5 min read",
    views: 1100,
    tag: "Roadmap",
    content: [
      {
        heading: "Start with the fundamentals",
        text: "Learn semantic HTML, responsive CSS and JavaScript fundamentals. Build small projects instead of relying only on tutorials.",
      },
      {
        heading: "Build full-stack projects",
        text: "Choose a frontend framework and learn how HTTP APIs connect it to a backend. Practice authentication, database operations and validation.",
      },
      {
        heading: "Prepare for real-world development",
        text: "Use Git, write tests, document your work and deploy projects. A portfolio of finished projects demonstrates practical skills.",
      },
    ],
  },
];

const topics = [
  "All",
  "Java",
  "React",
  "Spring Boot",
  "Database",
  "Web Development",
];

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">&lt;/&gt;</span>
          <span>
            CodeForge<span className="brand-accent">Stack</span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#articles">Articles</Link>
          <Link to="/#topics">Topics</Link>
        </nav>

        <a className="nav-cta" href="mailto:hello@codeforgestack.dev">
          Contact <span aria-hidden="true">↗</span>
        </a>
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

function ArticleCard({ article, index }) {
  return (
    <article className="article-card" style={{ "--card-index": index }}>
      <div className="card-topline">
        <span className="category-badge">{article.category}</span>
        <span className="read-time">{article.readTime}</span>
      </div>

      <Link
        className="card-title"
        to={`/articles/${article.id}`}
        aria-label={`Read ${article.title}`}
      >
        {article.title}
      </Link>

      <p className="card-description">{article.description}</p>

      <div className="card-meta">
        <span>{article.author}</span>
        <span>
          {new Date(`${article.date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <Link className="read-link" to={`/articles/${article.id}`}>
        Read article <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

function HomePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles
      .filter((article) => {
        const matchesCategory =
          activeCategory === "All" || article.category === activeCategory;

        const searchableText = [
          article.title,
          article.description,
          article.category,
          article.tag,
          article.author,
        ]
          .join(" ")
          .toLowerCase();

        return matchesCategory && searchableText.includes(query);
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.views - a.views;
        if (sortBy === "oldest") return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [search, activeCategory, sortBy]);

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
    setSortBy("latest");
  }

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />A BLOG FOR BUILDERS
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
              Explore articles <span aria-hidden="true">↓</span>
            </a>
            <a className="button-secondary" href="#topics">
              Browse topics
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{articles.length.toString().padStart(2, "0")}+</strong>
              <span>Sample articles</span>
            </div>
            <div className="stat-divider" />
            <div>
              <strong>{topics.length - 1}</strong>
              <span>Tech topics</span>
            </div>
            <div className="stat-divider" />
            <div>
              <strong>100%</strong>
              <span>Developer focused</span>
            </div>
          </div>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <span className="decoration-bracket">{"{"}</span>
          <span className="decoration-code">learn();</span>
          <span className="decoration-code">build();</span>
          <span className="decoration-code">repeat();</span>
          <span className="decoration-bracket">{"}"}</span>
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
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1 ? "article" : "articles"}
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
              placeholder="Search articles, topics or keywords..."
              aria-label="Search articles"
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className="sort-control">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort articles"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most popular</option>
            </select>
          </label>
        </div>

        <div className="category-filters" aria-label="Filter by category">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              className={`filter-chip ${
                activeCategory === topic ? "active" : ""
              }`}
              onClick={() => setActiveCategory(topic)}
              aria-pressed={activeCategory === topic}
            >
              {topic}
            </button>
          ))}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="articles-grid">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              ⌕
            </span>
            <h3>No articles found</h3>
            <p>
              Try another keyword or select a different category to find what
              you are looking for.
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={clearFilters}
            >
              Clear all filters
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
              <p>Choose a topic and discover something new.</p>
            </div>
          </div>

          <div className="topics-grid">
            {topics
              .filter((topic) => topic !== "All")
              .map((topic, index) => {
                const count = articles.filter(
                  (article) => article.category === topic,
                ).length;

                return (
                  <button
                    type="button"
                    className="topic-card"
                    key={topic}
                    onClick={() => {
                      setActiveCategory(topic);
                      setSearch("");
                      document
                        .getElementById("articles")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="topic-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="topic-name">{topic}</span>
                    <span className="topic-count">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                    <span className="topic-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}

function ArticlePage() {
  const { articleId } = useParams();
  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    return (
      <main className="not-found">
        <span className="section-kicker">404 — ARTICLE NOT FOUND</span>
        <h1>
          This page doesn't exist<span className="heading-dot">.</span>
        </h1>
        <p>The article may have been moved or the URL may be incorrect.</p>
        <Link className="button-primary" to="/">
          Back to articles
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <Link className="back-link" to="/#articles">
        ← Back to articles
      </Link>

      <div className="article-header">
        <span className="category-badge">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="article-intro">{article.description}</p>
        <div className="article-meta">
          <span>{article.author}</span>
          <span>
            {new Date(`${article.date}T00:00:00`).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>{article.readTime}</span>
        </div>
      </div>

      <div className="article-body">
        <div className="article-notice">
          <span className="status-dot" />
          Sample article · Full blog publishing will be added in a later module.
        </div>

        {article.content.map((section, index) => (
          <section key={section.heading}>
            <h2>
              {index + 1}. {section.heading}
            </h2>
            <p>{section.text}</p>
          </section>
        ))}

        <div className="article-end">
          <span>Enjoyed this guide?</span>
          <Link to="/#articles">Explore more articles ↗</Link>
        </div>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="section-kicker">404 — PAGE NOT FOUND</span>
      <h1>Lost in the code?</h1>
      <p>Let's get you back to the knowledge hub.</p>
      <Link className="button-primary" to="/">
        Back to home
      </Link>
    </main>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:articleId" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

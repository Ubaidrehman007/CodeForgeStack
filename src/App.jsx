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
    category: "JAVA",
    title: "Java Collections Framework: A Practical Guide",
    description:
      "Understand Lists, Sets, Maps, and how to choose the right collection for your application.",
    readTime: "8 min read",
    tag: "Backend",
    content: [
      {
        heading: "What is the Collections Framework?",
        body: "The Java Collections Framework provides a standard set of interfaces and classes for storing and working with groups of objects. It includes structures such as List, Set, Queue, and Map.",
      },
      {
        heading: "List, Set, and Map",
        body: "Use a List when order and indexed access matter. Use a Set when unique elements are important. Use a Map to associate keys with values.",
      },
      {
        heading: "Choosing the right collection",
        body: "Consider ordering, uniqueness, lookup speed, and how data will change. ArrayList is a common starting point for lists, HashSet for unique values, and HashMap for key-value lookups.",
      },
    ],
  },
  {
    id: "react-components-state",
    category: "REACT",
    title: "React Components and State Explained",
    description:
      "Learn how components, props, and state work together to build interactive user interfaces.",
    readTime: "6 min read",
    tag: "Frontend",
    content: [
      {
        heading: "What are components?",
        body: "Components are reusable building blocks of a React interface. A component can combine markup, behavior, and styling to represent part of a page.",
      },
      {
        heading: "Props and state",
        body: "Props pass information from a parent component to a child. State represents information a component manages over time, such as a selected tab or input value.",
      },
      {
        heading: "Build reusable interfaces",
        body: "Break interfaces into components with clear responsibilities. Reuse components when their structure or behavior is shared, and keep state close to the components that need it.",
      },
    ],
  },
  {
    id: "spring-boot-rest-api",
    category: "SPRING BOOT",
    title: "Build Your First REST API with Spring Boot",
    description:
      "Explore controllers, services, and the basics of creating a maintainable REST API.",
    readTime: "10 min read",
    tag: "Backend",
    content: [
      {
        heading: "What is a REST API?",
        body: "A REST-style API exposes resources through HTTP endpoints. Clients can use methods such as GET, POST, PUT, and DELETE to interact with those resources.",
      },
      {
        heading: "Understand the layers",
        body: "A controller handles HTTP requests, a service contains business logic, and a repository typically handles persistence. Separating these responsibilities makes an application easier to maintain.",
      },
      {
        heading: "Test your endpoints",
        body: "Run the Spring Boot application and test your endpoints using a tool such as Postman. Check status codes, response bodies, validation, and error handling.",
      },
    ],
  },
];

const topics = [
  "Java & Spring Boot",
  "Frontend Development",
  "Backend Engineering",
  "Databases & APIs",
];

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand" aria-label="CodeForge Stack home">
        <span className="brand-icon">&lt;/&gt;</span>
        <span>
          CodeForge<span className="brand-accent">Stack</span>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/#articles">Articles</Link>
        <Link to="/#topics">Topics</Link>
      </nav>

      <Link to="/#articles" className="nav-cta">
        Explore Articles <span>↗</span>
      </Link>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer" id="about">
      <Link to="/" className="brand">
        <span className="brand-icon">&lt;/&gt;</span>
        <span>
          CodeForge<span className="brand-accent">Stack</span>
        </span>
      </Link>

      <p>Built for developers who never stop learning.</p>

      <span className="footer-copyright">
        © {new Date().getFullYear()} CodeForge Stack
      </span>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-badge">
          <span className="status-dot" />A community for developers
        </div>

        <h1>
          Build better.
          <br />
          <span>Code smarter.</span>
        </h1>

        <p className="hero-description">
          Practical tutorials, engineering insights, and developer resources to
          help you build skills that matter.
        </p>

        <div className="hero-actions">
          <a href="#articles" className="button-primary">
            Explore Articles <span>↗</span>
          </a>
          <a href="#topics" className="button-secondary">
            Discover Topics
          </a>
        </div>

        <div className="hero-note" aria-label="Featured technologies">
          <span>Java</span>
          <span>React</span>
          <span>Spring Boot</span>
          <span>Web Development</span>
        </div>
      </section>

      <section className="articles-section" id="articles">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE KNOWLEDGE HUB</p>
            <h2>
              Explore the Stack<span>.</span>
            </h2>
          </div>

          <p className="section-description">
            Learn something new. Build something meaningful.
          </p>
        </div>

        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.id}>
              <div className="article-card-top">
                <span className="article-category">{article.category}</span>
                <span className="article-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className="article-card-content">
                <span className="article-tag">{article.tag}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </div>

              <div className="article-card-footer">
                <span>Sample article</span>
                <span>{article.readTime}</span>
              </div>

              <Link
                className="article-read-link"
                to={`/articles/${article.id}`}
                aria-label={`Read ${article.title}`}
              >
                Read article <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="topics-section" id="topics">
        <p className="eyebrow">WHAT YOU CAN EXPLORE</p>
        <h2>Learn by building.</h2>

        <div className="topic-list">
          {topics.map((topic) => (
            <div className="topic-item" key={topic}>
              <span className="topic-symbol">&lt;/&gt;</span>
              <span>{topic}</span>
              <span className="topic-arrow">↗</span>
            </div>
          ))}
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
      <main className="article-page">
        <p className="eyebrow">404 — ARTICLE NOT FOUND</p>
        <h1>We couldn't find that article.</h1>
        <p className="article-intro">
          The article may have moved, or the URL may be incorrect.
        </p>
        <Link className="button-primary" to="/">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>

      <div className="article-page-header">
        <span className="article-category">{article.category}</span>
        <span className="article-tag">{article.tag}</span>
      </div>

      <h1>{article.title}</h1>
      <p className="article-intro">{article.description}</p>

      <div className="article-meta">
        <span>{article.readTime}</span>
        <span>CodeForge Stack Editorial</span>
        <span>Sample content</span>
      </div>

      <div className="article-body">
        <p>{article.description}</p>

        {article.content.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>

      <div className="article-end">
        <p>Keep learning. Keep building.</p>
        <Link to="/" className="button-secondary">
          Explore more articles
        </Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/:articleId" element={<ArticlePage />} />
          <Route
            path="*"
            element={
              <main className="article-page">
                <p className="eyebrow">404 — PAGE NOT FOUND</p>
                <h1>This page doesn't exist.</h1>
                <Link className="button-primary" to="/">
                  Back to home
                </Link>
              </main>
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

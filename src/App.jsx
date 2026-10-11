import "./App.css";

const articles = [
  {
    id: 1,
    category: "JAVA",
    title: "Java Collections Framework: A Practical Guide",
    description:
      "Understand Lists, Sets, Maps, and how to choose the right collection for your application.",
    readTime: "8 min read",
    tag: "Backend",
  },
  {
    id: 2,
    category: "REACT",
    title: "React Components and State Explained",
    description:
      "Learn how components, props, and state work together to build interactive user interfaces.",
    readTime: "6 min read",
    tag: "Frontend",
  },
  {
    id: 3,
    category: "SPRING BOOT",
    title: "Build Your First REST API with Spring Boot",
    description:
      "Explore controllers, services, and the basics of creating a maintainable REST API.",
    readTime: "10 min read",
    tag: "Backend",
  },
];

const topics = [
  "Java & Spring Boot",
  "Frontend Development",
  "Backend Engineering",
  "Databases & APIs",
];

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand" aria-label="CodeForge Stack home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            CodeForge<span className="brand-accent">Stack</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#articles">Articles</a>
          <a href="#topics">Topics</a>
          <a href="#about">About</a>
        </nav>

        <a href="#articles" className="nav-cta">
          Explore Articles <span>↗</span>
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-badge">
            <span className="status-dot" />A community for developers
          </div>

          <h1>
            Build better.
            <br />
            <span>Code smarter.</span>
          </h1>

          <p className="hero-description">
            Practical tutorials, engineering insights, and developer resources
            to help you build skills that matter.
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
                  <span>Coming soon</span>
                  <span>{article.readTime}</span>
                </div>
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
      </main>

      <footer className="footer" id="about">
        <a href="#home" className="brand">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            CodeForge<span className="brand-accent">Stack</span>
          </span>
        </a>

        <p>Built for developers who never stop learning.</p>

        <span className="footer-copyright">
          © {new Date().getFullYear()} CodeForge Stack
        </span>
      </footer>
    </div>
  );
}

export default App;

import { useState } from "react";
import { Link } from "react-router-dom";
import homeLibrary from "../assets/home-library.png";
import { homepageContent } from "../data/homepageContent.js";
import "./HomePage.css";

function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);
  const content = homepageContent;

  return (
    <div className={`home-page${isDarkMode ? " is-dark" : ""}`}>
      <header className="home-header">
        <Link className="home-logo" to="/" aria-label={`${content.brandName} trang chủ`}>
          <span className="home-logo-icon" aria-hidden="true">
            S
          </span>
          <span>{content.brandName}</span>
        </Link>

        <nav className="home-nav" aria-label="Điều hướng trang chủ">
          {content.navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="home-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDarkMode((currentMode) => !currentMode)}
            aria-label={isDarkMode ? content.actions.lightMode : content.actions.darkMode}
          >
            {isDarkMode ? "☼" : "●"}
          </button>
          <Link className="home-login-btn" to="/login">
            {content.actions.login}
          </Link>
          <Link className="home-join-btn" to="/register">
            {content.actions.join}
          </Link>
        </div>
      </header>

      <main className="home-main">
        <section className="home-hero" id="explore" aria-labelledby="home-title">
          <div className="home-hero-content">
            <p className="home-eyebrow">{content.hero.badge}</p>
            <h1 id="home-title">
              {content.hero.title}
              <span>{content.hero.titleAccent}</span>
            </h1>
            <p className="home-description">{content.hero.description}</p>

            <div className="home-hero-actions">
              <Link to="/register" className="home-primary-btn">
                <span>{content.actions.primary}</span>
                <span className="home-primary-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <div className="home-members" aria-label={content.hero.activeMembers}>
                <div className="member-avatars" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span>+50k</span>
                </div>
                <p>{content.hero.activeMembers}</p>
              </div>
            </div>
          </div>

          <div className="home-hero-visual">
            {heroImageError ? (
              <div className="home-hero-placeholder" role="img" aria-label={content.hero.imageAlt}>
                <span>{content.hero.placeholder}</span>
              </div>
            ) : (
              <img src={homeLibrary} alt={content.hero.imageAlt} onError={() => setHeroImageError(true)} />
            )}
            <div className="floating-card">
              <div className="floating-icon" aria-hidden="true">
                S
              </div>
              <div>
                <strong>{content.floatingCard.title}</strong>
                <p>{content.floatingCard.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="home-stats" id="community" aria-label={`Thống kê ${content.brandName}`}>
          {content.stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="home-featured-books" id="library" aria-labelledby="featured-books-title">
          <div className="home-section-heading">
            <div>
              <h2 id="featured-books-title">{content.featuredSection.title}</h2>
              <p>{content.featuredSection.description}</p>
            </div>
            <div className="home-book-controls" aria-hidden="true">
              <button type="button">‹</button>
              <button type="button">›</button>
            </div>
          </div>

          <div className="home-book-list">
            {content.featuredBooks.map((book) => (
              <article className="home-book-card" key={book.title}>
                <div className={`home-book-cover ${book.coverClass}`}>
                  <span className="book-cover-border" />
                  <span className="book-cover-title">{book.title}</span>
                  <span className="book-cover-author">{book.author}</span>
                </div>
                <div className="home-book-meta">
                  <span className="home-book-category">{book.category}</span>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <div className="home-book-stats">
                    <span>★ {book.rating}</span>
                    <span>{book.discussions}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-quote-section" id="events" aria-label={content.quote.ariaLabel}>
          <span className="home-quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>
            <p>{content.quote.text}</p>
            <footer>
              <div className="home-scholar-avatar" aria-hidden="true">
                {content.quote.initials}
              </div>
              <cite>{content.quote.author}</cite>
              <span>{content.quote.organization}</span>
            </footer>
          </blockquote>
        </section>
      </main>
    </div>
  );
}

export default HomePage;

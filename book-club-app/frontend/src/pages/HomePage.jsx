import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import homeLibrary from "../assets/home-library.png";
import { useAuth } from "../contexts/AuthContext.jsx";
import NotificationBell from "../components/notifications/NotificationBell.jsx";
import { homepageContent } from "../data/homepageContent.js";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);
  const content = homepageContent;
  const userName = user?.full_name || user?.fullName || user?.name || "Thành viên";
  const userPoints = user?.point_balance ?? user?.pointBalance ?? user?.points ?? 20;
  const primaryActionPath = isAuthenticated ? "/books" : "/register";
  const primaryActionLabel = isAuthenticated ? "Tiếp tục khám phá sách" : content.actions.primary;

  const navItems = content.navItems.map((item) => {
    if (item.label === "Khám phá") {
      return { ...item, href: isAuthenticated ? "/books" : "#explore" };
    }

    if (item.label === "Cộng đồng") {
      return { ...item, href: isAuthenticated ? "/transactions" : "/register" };
    }

    if (item.label === "Thư viện") {
      return { ...item, href: isAuthenticated ? "/books" : "/login" };
    }

    return item;
  });

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  function renderNavItem(item) {
    if (item.href.startsWith("/")) {
      return (
        <Link to={item.href} key={item.label}>
          {item.label}
        </Link>
      );
    }

    return (
      <a href={item.href} key={item.label}>
        {item.label}
      </a>
    );
  }

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
          {navItems.map(renderNavItem)}
        </nav>

        <div className="home-actions">
          {isAuthenticated ? <NotificationBell /> : null}
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setIsDarkMode((currentMode) => !currentMode)}
            aria-label={isDarkMode ? content.actions.lightMode : content.actions.darkMode}
          >
            {isDarkMode ? "☼" : "●"}
          </button>
          {isAuthenticated ? (
            <>
              <div className="home-user-summary" aria-label="Thông tin thành viên">
                <strong>{userName}</strong>
                <span>{userPoints} điểm</span>
              </div>
              <Link className="home-dashboard-btn" to="/books">
                Vào thư viện
              </Link>
              <button className="home-logout-btn" type="button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="home-login-btn" to="/login">
                {content.actions.login}
              </Link>
              <Link className="home-join-btn" to="/register">
                {content.actions.join}
              </Link>
            </>
          )}
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
              <Link to={primaryActionPath} className="home-primary-btn">
                <span>{primaryActionLabel}</span>
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

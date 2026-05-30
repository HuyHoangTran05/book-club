import { useState } from "react";
import { Link } from "react-router-dom";
import homeLibrary from "../assets/home-library.png";
import "./HomePage.css";

const featuredBooks = [
  {
    category: "Triết học",
    title: "Lý thuyết Hạnh phúc",
    author: "Marcus Aurelius",
    rating: "4.9",
    discussions: "124 Nhóm",
    coverClass: "book-cover-philosophy",
  },
  {
    category: "Kinh tế",
    title: "Lịch sử Tiền tệ",
    author: "Niall Ferguson",
    rating: "4.8",
    discussions: "86 Nhóm",
    coverClass: "book-cover-economics",
  },
  {
    category: "Khoa học",
    title: "Tâm lý học Hành vi",
    author: "Daniel Kahneman",
    rating: "4.7",
    discussions: "99 Nhóm",
    coverClass: "book-cover-science",
  },
  {
    category: "Văn học",
    title: "Những Thư viện Mơ",
    author: "Jorge Luis Borges",
    rating: "4.9",
    discussions: "72 Nhóm",
    coverClass: "book-cover-literature",
  },
];

function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  return (
    <>
      {/* Khi dán HTML từ Stitch/Figma, cần đổi class thành className. */}
      {/* Đổi for thành htmlFor. */}
      {/* Đóng tag đúng chuẩn JSX. */}
      {/* Không dán thẻ html/body. */}
      {/* Chỉ dán phần bên trong component. */}
      {/* ================= STITCH / FIGMA HOMEPAGE HTML PASTE ZONE START ================= */}
      <div className={`home-page${isDarkMode ? " is-dark" : ""}`}>
        <header className="home-header">
          <Link className="home-logo" to="/" aria-label="BookCommunity trang chủ">
            <span className="home-logo-icon" aria-hidden="true">
              ▣
            </span>
            <span>BookCommunity</span>
          </Link>

          <nav className="home-nav" aria-label="Điều hướng trang chủ">
            <a href="#explore">Khám phá</a>
            <a href="#community">Cộng đồng</a>
            <a href="#library">Thư viện</a>
            <a href="#events">Sự kiện</a>
          </nav>

          <div className="home-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setIsDarkMode((currentMode) => !currentMode)}
              aria-label={isDarkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            >
              {isDarkMode ? "☼" : "◐"}
            </button>
            <Link className="home-login-btn" to="/login">
              Đăng nhập
            </Link>
            <Link className="home-join-btn" to="/register">
              Tham gia ngay
            </Link>
          </div>
        </header>

        <main className="home-main">
          <section className="home-hero" id="explore" aria-labelledby="home-title">
            <div className="home-hero-content">
              <p className="home-eyebrow">Câu lạc bộ đọc sách học thuật</p>
              <h1 id="home-title">
                Nơi tri thức hội tụ,
                <span> cộng đồng sẻ chia.</span>
              </h1>
              <p className="home-description">
                Tham gia vào mạng lưới học thuật hàng đầu để thảo luận, nghiên cứu và kết nối
                qua những cuốn sách giá trị.
              </p>

              <div className="home-hero-actions">
                <Link to="/register" className="home-primary-btn">
                  <span>Bắt đầu hành trình</span>
                  <span className="home-primary-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>

                <div className="home-members" aria-label="Thành viên tích cực">
                  <div className="member-avatars" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span>+50k</span>
                  </div>
                  <p>Thành viên tích cực</p>
                </div>
              </div>
            </div>

            <div className="home-hero-visual">
              {heroImageError ? (
                <div className="home-hero-placeholder" role="img" aria-label="Không gian thư viện BookCommunity">
                  <span>BookCommunity Library</span>
                </div>
              ) : (
                <img
                  src={homeLibrary}
                  alt="Không gian thư viện BookCommunity"
                  onError={() => setHeroImageError(true)}
                />
              )}
              <div className="floating-card">
                <div className="floating-icon" aria-hidden="true">
                  ▣
                </div>
                <div>
                  <strong>Tài liệu mới</strong>
                  <p>24 bài nghiên cứu hôm nay</p>
                </div>
              </div>
            </div>
          </section>

          <section className="home-stats" id="community" aria-label="Thống kê BookCommunity">
            <div className="stat-item">
              <strong>50k+</strong>
              <span>Thành viên</span>
            </div>
            <div className="stat-item">
              <strong>10k+</strong>
              <span>Nhóm thảo luận</span>
            </div>
            <div className="stat-item">
              <strong>2k+</strong>
              <span>Bài nghiên cứu</span>
            </div>
          </section>

          <section className="home-featured-books" id="library" aria-labelledby="featured-books-title">
            <div className="home-section-heading">
              <div>
                <h2 id="featured-books-title">Sách nổi bật tuần này</h2>
                <p>Những tác phẩm được thảo luận nhiều nhất trong cộng đồng học thuật.</p>
              </div>
              <div className="home-book-controls" aria-hidden="true">
                <button type="button">‹</button>
                <button type="button">›</button>
              </div>
            </div>

            <div className="home-book-list">
              {featuredBooks.map((book) => (
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

          <section className="home-quote-section" id="events" aria-label="Chia sẻ từ học giả">
            <span className="home-quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>
              <p>
                Sách là ngọn đèn sáng cho trí tuệ con người. Qua mỗi trang sách, ta không
                chỉ tìm thấy kiến thức mà còn khám phá chính tâm hồn mình giữa cộng đồng
                những người cùng chí hướng.
              </p>
              <footer>
                <div className="home-scholar-avatar" aria-hidden="true">
                  ĐV
                </div>
                <cite>GS. Đặng Văn Minh</cite>
                <span>Viện nghiên cứu Văn hoá & Xã hội</span>
              </footer>
            </blockquote>
          </section>
        </main>
      </div>
      {/* ================= STITCH / FIGMA HOMEPAGE HTML PASTE ZONE END ================= */}
    </>
  );
}

export default HomePage;

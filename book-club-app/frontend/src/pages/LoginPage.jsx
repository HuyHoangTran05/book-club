import { useState } from "react";
import { Link } from "react-router-dom";
import loginHero from "../assets/login-hero.png";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validateForm() {
    if (!email.trim()) {
      return "Vui lòng nhập email.";
    }

    if (!password.trim()) {
      return "Vui lòng nhập mật khẩu.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      console.log("Login form data", Object.fromEntries(formData.entries()));
    } catch (submitError) {
      setError(submitError.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-hero" aria-label="Thương hiệu Cộng Đồng Sách">
        <div className="login-hero-content">
          <div className="login-brand-row">
            <div className="login-brand-mark" aria-hidden="true">
              <span className="login-brand-book" />
              <span className="login-brand-leaf" />
            </div>
            <p className="login-brand-name">Cộng Đồng Sách</p>
          </div>

          <div className="login-hero-image-wrap">
            <img src={loginHero} alt="Cộng đồng đọc sách" className="login-hero-image" />
          </div>

          <div className="login-hero-copy">
            <h1>Kết nối tri thức qua từng cuốn sách</h1>
            <p>Nền tảng giúp thành viên chia sẻ, trao đổi và lan tỏa văn hóa đọc trong cộng đồng.</p>
          </div>
        </div>
      </section>

      <section className="login-panel" aria-label="Đăng nhập Cộng Đồng Sách">
        <div className="login-card">
          <div className="login-mobile-brand">
            <div className="login-brand-mark" aria-hidden="true">
              <span className="login-brand-book" />
              <span className="login-brand-leaf" />
            </div>
            <p>Cộng Đồng Sách</p>
          </div>

          <div className="login-form-heading">
            <p className="login-form-eyebrow">Thành viên câu lạc bộ</p>
            <h2 id="login-title">Đăng nhập</h2>
            <p>Chào mừng bạn quay lại với cộng đồng đọc sách</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error ? (
              <div className="login-error-message" role="alert">
                {error}
              </div>
            ) : null}

            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button className="login-submit-button" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="login-register-text">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;

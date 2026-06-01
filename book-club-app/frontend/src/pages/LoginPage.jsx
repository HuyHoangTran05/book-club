import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import loginHero from "../assets/login-hero.png";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTimerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

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
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      setSuccess("Đăng nhập thành công!");
      redirectTimerRef.current = setTimeout(() => {
        navigate(location.state?.from?.pathname || "/", { replace: true });
      }, 500);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-hero" aria-label="Thương hiệu Cộng Đồng Sách">
        <div className="login-hero-content">
          <Link to="/" className="login-brand-row" aria-label="Về trang chủ">
            <div className="login-brand-mark" aria-hidden="true">
              <span className="login-brand-book" />
              <span className="login-brand-leaf" />
            </div>
            <p className="login-brand-name">Cộng Đồng Sách</p>
          </Link>

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
          <Link to="/" className="login-card-home-link" aria-label="Về trang chủ">
            ← Về trang chủ
          </Link>

          <Link to="/" className="login-mobile-brand" aria-label="Về trang chủ">
            <div className="login-brand-mark" aria-hidden="true">
              <span className="login-brand-book" />
              <span className="login-brand-leaf" />
            </div>
            <p>Cộng Đồng Sách</p>
          </Link>

          <div className="login-form-heading">
            <p className="login-form-eyebrow">Thành viên câu lạc bộ</p>
            <h2 id="login-title">Đăng nhập</h2>
            <p>Chào mừng bạn quay lại với cộng đồng đọc sách</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {success ? (
              <div className="login-success-message" role="status">
                {success}
              </div>
            ) : null}

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
                disabled={loading || Boolean(success)}
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
                disabled={loading || Boolean(success)}
                required
              />
            </div>

            <button className="login-submit-button" type="submit" disabled={loading || Boolean(success)}>
              {loading ? "Đang đăng nhập..." : success ? "Đang chuyển về trang chủ..." : "Đăng nhập"}
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

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, register as registerUser } from "../services/authService.js";
import "./RegisterPage.css";

const heroImages = import.meta.glob("../assets/*-hero.png", {
  eager: true,
  import: "default",
});

const registerHero =
  heroImages["../assets/register-hero.png"] || heroImages["../assets/login-hero.png"];

function RegisterPage() {
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    if (!fullName.trim()) {
      return "Vui lòng nhập họ và tên.";
    }

    if (!email.trim()) {
      return "Vui lòng nhập email.";
    }

    if (!phoneNumber.trim()) {
      return "Vui lòng nhập số điện thoại.";
    }

    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
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
      await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
        password,
      });

      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      redirectTimerRef.current = setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, "Đăng ký thất bại. Vui lòng thử lại.", "register"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page" aria-labelledby="register-title">
      <section className="register-hero" aria-label="Thương hiệu Cộng Đồng Sách">
        <div className="register-hero-content">
          <Link to="/" className="register-brand-row" aria-label="Về trang chủ">
            <div className="register-brand-mark" aria-hidden="true">
              <span className="register-brand-book" />
              <span className="register-brand-leaf" />
            </div>
            <p className="register-brand-name">Cộng Đồng Sách</p>
          </Link>

          <div className="register-hero-image-wrap">
            {registerHero ? (
              <img src={registerHero} alt="Cộng đồng đọc sách" className="register-hero-image" />
            ) : (
              <div className="register-hero-image register-hero-image-fallback" aria-hidden="true" />
            )}
          </div>

          <div className="register-hero-copy">
            <h1>Tham gia cộng đồng đọc sách thông minh</h1>
            <p>Tạo tài khoản để chia sẻ sách, kết nối thành viên và tích lũy điểm thưởng trong cộng đồng.</p>
          </div>
        </div>
      </section>

      <section className="register-panel" aria-label="Đăng ký Cộng Đồng Sách">
        <div className="register-card">
          <Link to="/" className="register-card-home-link" aria-label="Về trang chủ">
            ← Về trang chủ
          </Link>

          <Link to="/" className="register-mobile-brand" aria-label="Về trang chủ">
            <div className="register-brand-mark" aria-hidden="true">
              <span className="register-brand-book" />
              <span className="register-brand-leaf" />
            </div>
            <p>Cộng Đồng Sách</p>
          </Link>

          <div className="register-form-heading">
            <p className="register-form-eyebrow">Thành viên mới</p>
            <h2 id="register-title">Đăng ký</h2>
            <p>Tạo tài khoản Cộng Đồng Sách của bạn</p>
          </div>

          <div className="register-info-message">
            Tài khoản mới nhận 20 điểm khởi đầu.
          </div>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {success ? (
              <div className="register-success" role="status">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="register-error" role="alert">
                {error}
              </div>
            ) : null}

            <div className="register-field">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                disabled={loading || Boolean(success)}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nguyenvana@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading || Boolean(success)}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="0912345678"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                disabled={loading || Boolean(success)}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Tạo mật khẩu"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading || Boolean(success)}
                required
              />
            </div>

            <button className="register-submit-button" type="submit" disabled={loading || Boolean(success)}>
              {loading ? "Đang đăng ký..." : success ? "Đang chuyển đến đăng nhập..." : "Đăng ký"}
            </button>
          </form>

          <p className="register-login-text">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;

import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  changePassword,
  getMyProfile,
  getPasswordErrorMessage,
  getProfileErrorMessage,
  updateMyProfile,
} from "../services/profileService.js";
import { displayPersonName } from "../utils/vietnameseDisplay.js";
import "./ProfilePage.css";

const initialInfoValues = {
  full_name: "",
  email: "",
  phone: "",
};

const initialPasswordValues = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const roleLabels = {
  member: "Thành viên",
  admin: "Quản trị viên",
  deliverer: "Người giao sách",
};

const statusLabels = {
  active: "Đang hoạt động",
  inactive: "Tạm ngưng",
  banned: "Bị khóa",
  pending: "Đang chờ",
};

function getProfileValue(profile, ...keys) {
  for (const key of keys) {
    const value = profile?.[key] ?? profile?.raw?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
}

function getProfileName(profile, fallback = "Thành viên") {
  return displayPersonName(
    getProfileValue(profile, "full_name", "fullName", "name") || fallback,
    fallback
  );
}

function getProfilePoints(profile) {
  const value = getProfileValue(profile, "point_balance", "pointBalance", "points");
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
}

function getRoleLabel(profile) {
  if (profile?.is_deliverer || profile?.isDeliverer || profile?.raw?.is_deliverer || profile?.raw?.isDeliverer) {
    return "Người giao sách";
  }

  const role = String(getProfileValue(profile, "role") || "member").toLowerCase();
  return roleLabels[role] || "Thành viên";
}

function getStatusLabel(profile) {
  const status = String(getProfileValue(profile, "account_status", "accountStatus", "status") || "active").toLowerCase();
  return statusLabels[status] || "Đang hoạt động";
}

function getEmailVerifiedLabel(profile) {
  const isVerified = Boolean(
    profile?.email_verified ?? profile?.emailVerified ?? profile?.raw?.email_verified ?? profile?.raw?.emailVerified
  );

  return isVerified ? "Email đã xác thực" : "Email chưa xác thực";
}

function getInitials(name) {
  const words = displayPersonName(name, "Thành viên")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "TV";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[words.length - 2][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
}

function isValidVietnamesePhone(value) {
  if (!value) {
    return true;
  }

  return /^0\d{9}$/.test(value);
}

function formatDate(value) {
  if (!value) {
    return "Chưa rõ";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa rõ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function mergeStoredUser(profile) {
  if (typeof localStorage === "undefined") {
    return;
  }

  const storedUser = localStorage.getItem("user");
  let currentUser = {};

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    currentUser = {};
  }

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...currentUser,
      ...profile.raw,
      ...profile,
      fullName: profile.full_name,
      pointBalance: profile.point_balance,
    })
  );
}

function ProfilePage() {
  const { refreshUser, user } = useAuth();
  const [errors, setErrors] = useState({});
  const [infoValues, setInfoValues] = useState(initialInfoValues);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordValues, setPasswordValues] = useState(initialPasswordValues);
  const [profile, setProfile] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const displayProfile = profile || user || {};
  const profileName = getProfileName(displayProfile);
  const profileEmail = getProfileValue(displayProfile, "email") || "Chưa có email";
  const profilePhone = getProfileValue(displayProfile, "phone", "phone_number", "phoneNumber") || "Chưa cập nhật";
  const profilePoints = getProfilePoints(displayProfile);
  const pointsText = profilePoints === null ? "-- điểm" : `${profilePoints} điểm`;

  const accountDetails = useMemo(
    () => [
      { label: "Vai trò", value: getRoleLabel(displayProfile) },
      { label: "Trạng thái", value: getStatusLabel(displayProfile) },
      { label: "Xác thực email", value: getEmailVerifiedLabel(displayProfile) },
      { label: "Ngày tham gia", value: formatDate(getProfileValue(displayProfile, "created_at", "createdAt")) },
    ],
    [displayProfile]
  );

  async function loadProfile() {
    setIsLoading(true);
    setLoadError("");
    setMessage("");

    try {
      const result = await getMyProfile();
      setProfile(result);
      setInfoValues({
        full_name: getProfileName(result, ""),
        email: result.email || "",
        phone: result.phone || "",
      });
      mergeStoredUser(result);
    } catch (error) {
      console.error("Profile load error:", error.response?.data || error.message);
      setLoadError("Không thể tải hồ sơ cá nhân. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleInfoChange(event) {
    const { name, value } = event.target;
    setInfoValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function validateInfoForm() {
    const nextErrors = {};

    if (!infoValues.full_name.trim()) {
      nextErrors.full_name = "Vui lòng nhập họ và tên.";
    }

    if (!isValidVietnamesePhone(infoValues.phone.trim())) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }

    return nextErrors;
  }

  function validatePasswordForm() {
    const nextErrors = {};

    if (!passwordValues.current_password) {
      nextErrors.current_password = "Vui lòng nhập mật khẩu hiện tại.";
    }

    if (!passwordValues.new_password) {
      nextErrors.new_password = "Vui lòng nhập mật khẩu mới.";
    } else if (passwordValues.new_password.length < 8) {
      nextErrors.new_password = "Mật khẩu mới phải có ít nhất 8 ký tự.";
    }

    if (!passwordValues.confirm_password) {
      nextErrors.confirm_password = "Vui lòng xác nhận mật khẩu mới.";
    } else if (passwordValues.confirm_password !== passwordValues.new_password) {
      nextErrors.confirm_password = "Mật khẩu xác nhận không khớp.";
    }

    if (
      passwordValues.current_password &&
      passwordValues.new_password &&
      passwordValues.current_password === passwordValues.new_password
    ) {
      nextErrors.new_password = "Mật khẩu mới phải khác mật khẩu hiện tại.";
    }

    return nextErrors;
  }

  async function handleInfoSubmit(event) {
    event.preventDefault();

    const nextErrors = validateInfoForm();
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSavingProfile(true);

    try {
      const updatedProfile = await updateMyProfile({
        full_name: infoValues.full_name.trim(),
        phone: infoValues.phone.trim(),
      });
      setProfile(updatedProfile);
      setInfoValues({
        full_name: getProfileName(updatedProfile, ""),
        email: updatedProfile.email || infoValues.email,
        phone: updatedProfile.phone || "",
      });
      mergeStoredUser(updatedProfile);
      setMessageType("success");
      setMessage("Cập nhật thông tin cá nhân thành công.");

      try {
        const latestUser = await refreshUser?.();
        if (latestUser) {
          localStorage.setItem("user", JSON.stringify(latestUser));
        }
      } catch (refreshError) {
        console.error("Profile refresh error:", refreshError.response?.data || refreshError.message);
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(getProfileErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    const nextErrors = validatePasswordForm();
    setPasswordErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(passwordValues);
      setPasswordValues(initialPasswordValues);
      setPasswordErrors({});
      setMessageType("success");
      setMessage("Đổi mật khẩu thành công.");
    } catch (error) {
      console.error("Password change error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(getPasswordErrorMessage(error));
    } finally {
      setIsChangingPassword(false);
    }
  }

  function togglePasswordVisibility(fieldName) {
    setShowPasswords((currentValues) => ({
      ...currentValues,
      [fieldName]: !currentValues[fieldName],
    }));
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div>
          <p>Tài khoản cá nhân</p>
          <h1>Hồ sơ cá nhân</h1>
          <span>Quản lý thông tin cá nhân, bảo mật tài khoản và điểm thưởng của bạn.</span>
        </div>
      </section>

      {message ? <Alert type={messageType}>{message}</Alert> : null}

      {isLoading ? (
        <Card className="profile-state" aria-live="polite">
          Đang tải hồ sơ cá nhân...
        </Card>
      ) : null}

      {!isLoading && loadError ? (
        <Card className="profile-state" role="alert">
          <h2>Không thể tải hồ sơ cá nhân</h2>
          <p>{loadError}</p>
          <Button type="button" onClick={loadProfile}>
            Thử lại
          </Button>
        </Card>
      ) : null}

      {!isLoading && !loadError && !displayProfile ? (
        <Card className="profile-state">
          Chưa có thông tin hồ sơ.
        </Card>
      ) : null}

      {!isLoading && !loadError ? (
        <section className="profile-layout">
          <div className="profile-left-column">
            <Card className="profile-summary-card">
              <div className="profile-avatar" aria-hidden="true">
                {getInitials(profileName)}
              </div>
              <div>
                <h2>{profileName}</h2>
                <p>{profileEmail}</p>
              </div>
              <Badge status="completed" className="profile-point-badge">
                {pointsText}
              </Badge>
            </Card>

            <Card className="profile-account-card">
              <div className="profile-section-header">
                <h2>Tổng quan tài khoản</h2>
                <p>Thông tin trạng thái và vai trò trong cộng đồng.</p>
              </div>
              <dl>
                <div>
                  <dt>Số điện thoại</dt>
                  <dd>{profilePhone}</dd>
                </div>
                {accountDetails.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>

          <div className="profile-right-column">
            <Card>
              <div className="profile-section-header">
                <h2>Thông tin cá nhân</h2>
                <p>Cập nhật thông tin cơ bản để các thành viên khác có thể liên hệ với bạn.</p>
              </div>

              <form className="profile-form" onSubmit={handleInfoSubmit}>
                <label className="profile-field" htmlFor="full-name">
                  <span>Họ và tên</span>
                  <input
                    id="full-name"
                    name="full_name"
                    value={infoValues.full_name}
                    onChange={handleInfoChange}
                    disabled={isSavingProfile}
                    autoComplete="name"
                  />
                  {errors.full_name ? <small>{errors.full_name}</small> : null}
                </label>

                <label className="profile-field" htmlFor="profile-email">
                  <span>Email</span>
                  <input id="profile-email" name="email" value={infoValues.email} readOnly />
                  <em>Email dùng để đăng nhập và không thể thay đổi tại đây.</em>
                </label>

                <label className="profile-field" htmlFor="profile-phone">
                  <span>Số điện thoại</span>
                  <input
                    id="profile-phone"
                    name="phone"
                    value={infoValues.phone}
                    onChange={handleInfoChange}
                    disabled={isSavingProfile}
                    inputMode="tel"
                    placeholder="0901000001"
                    autoComplete="tel"
                  />
                  {errors.phone ? <small>{errors.phone}</small> : null}
                </label>

                <div className="profile-actions">
                  <Button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </Card>

            <Card>
              <div className="profile-section-header">
                <h2>Đổi mật khẩu</h2>
                <p>Cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>
              </div>

              <form className="profile-form" onSubmit={handlePasswordSubmit}>
                {[
                  ["current_password", "Mật khẩu hiện tại", "current-password"],
                  ["new_password", "Mật khẩu mới", "new-password"],
                  ["confirm_password", "Xác nhận mật khẩu mới", "confirm-password"],
                ].map(([name, label, autoComplete]) => (
                  <label className="profile-field" htmlFor={name} key={name}>
                    <span>{label}</span>
                    <div className="profile-password-control">
                      <input
                        id={name}
                        name={name}
                        type={showPasswords[name] ? "text" : "password"}
                        value={passwordValues[name]}
                        onChange={handlePasswordChange}
                        disabled={isChangingPassword}
                        autoComplete={autoComplete}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(name)}
                        disabled={isChangingPassword}
                        aria-label={showPasswords[name] ? `Ẩn ${label.toLowerCase()}` : `Hiện ${label.toLowerCase()}`}
                      >
                        {showPasswords[name] ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                    {passwordErrors[name] ? <small>{passwordErrors[name]}</small> : null}
                  </label>
                ))}

                <div className="profile-actions">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ProfilePage;

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  getMyDelivererProfile,
  registerDeliverer,
  updateMyDelivererProfile,
} from "../services/delivererService.js";
import "./DelivererProfilePage.css";

const initialValues = {
  service_area: "",
  available_hours: "",
  is_active: true,
};

function getProfileValues(profile) {
  const delivererProfile = profile?.delivererProfile;

  if (!delivererProfile) {
    return initialValues;
  }

  return {
    service_area: delivererProfile.service_area || delivererProfile.serviceArea || "",
    available_hours: delivererProfile.available_hours || delivererProfile.availableHours || "",
    is_active: delivererProfile.is_active ?? delivererProfile.isActive ?? true,
  };
}

function getProfileStats(profile) {
  return profile?.delivererProfile?.total_deliveries ?? profile?.delivererProfile?.totalDeliveries ?? 0;
}

function DelivererProfilePage() {
  const { refreshUser } = useAuth();
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  const isRegistered = Boolean(profile?.is_deliverer || profile?.delivererProfile);
  const submitLabel = isRegistered ? "Cập nhật thông tin" : "Đăng ký làm người giao sách";

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setMessage("");

      try {
        const result = await getMyDelivererProfile();

        if (isMounted) {
          setProfile(result);
          setFormValues(getProfileValues(result));
        }
      } catch (loadError) {
        console.error("Deliverer profile load error:", loadError.response?.data || loadError.message);

        if (isMounted) {
          setMessage("Không thể tải hồ sơ người giao sách. Bạn vẫn có thể thử đăng ký lại.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusText = useMemo(() => {
    if (!isRegistered) {
      return "Chưa đăng ký";
    }

    return formValues.is_active ? "Đang nhận giao sách" : "Tạm ngưng nhận giao";
  }, [formValues.is_active, isRegistered]);

  function validate() {
    const nextErrors = {};

    if (!formValues.service_area.trim()) {
      nextErrors.service_area = "Vui lòng nhập khu vực giao sách.";
    }

    if (!formValues.available_hours.trim()) {
      nextErrors.available_hours = "Vui lòng nhập thời gian có thể giao.";
    }

    return nextErrors;
  }

  function handleChange(event) {
    const { checked, name, type, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = isRegistered
        ? await updateMyDelivererProfile(formValues)
        : await registerDeliverer(formValues);
      setProfile(result);
      setFormValues(getProfileValues(result));
      setMessage(isRegistered ? "Cập nhật hồ sơ người giao sách thành công." : "Đăng ký làm người giao sách thành công.");

      const latestUser = await refreshUser?.();
      if (latestUser) {
        localStorage.setItem("user", JSON.stringify(latestUser));
      }
    } catch (submitError) {
      console.error("Deliverer profile submit error:", submitError.response?.data || submitError.message);
      setMessage(submitError.response?.data?.message || "Không thể lưu hồ sơ người giao sách. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="deliverer-profile-page">
      <section className="deliverer-profile-hero">
        <div>
          <p>Người giao sách cộng đồng</p>
          <h1>Đăng ký giao sách</h1>
          <span>Chủ động hỗ trợ thành viên nhận sách và tích lũy thêm điểm thưởng giao sách.</span>
        </div>

        <Card className="deliverer-status-card">
          <p>Trạng thái</p>
          <strong>{statusText}</strong>
          <span>{getProfileStats(profile)} lượt giao hoàn tất</span>
        </Card>
      </section>

      {message ? <Alert type={message.includes("thành công") ? "success" : "error"}>{message}</Alert> : null}

      {isLoading ? (
        <Card className="deliverer-profile-state" aria-live="polite">
          Đang tải hồ sơ người giao sách...
        </Card>
      ) : (
        <Card>
          <div className="deliverer-form-header">
            <div>
              <h2>{isRegistered ? "Bạn đã là người giao sách" : "Thông tin đăng ký"}</h2>
              <p>
                {isRegistered
                  ? "Bạn có thể cập nhật khu vực, thời gian giao hoặc tạm ngưng nhận giao sách."
                  : "Điền thông tin để các thành viên khác có thể chọn bạn khi tạo giao dịch."}
              </p>
            </div>
          </div>

          <form className="deliverer-form" onSubmit={handleSubmit}>
            <label className="deliverer-field" htmlFor="service-area">
              <span>Khu vực giao sách</span>
              <input
                id="service-area"
                name="service_area"
                value={formValues.service_area}
                onChange={handleChange}
                placeholder="Cầu Giấy, Hà Nội"
              />
              {errors.service_area ? <small>{errors.service_area}</small> : null}
            </label>

            <label className="deliverer-field" htmlFor="available-hours">
              <span>Thời gian có thể giao</span>
              <input
                id="available-hours"
                name="available_hours"
                value={formValues.available_hours}
                onChange={handleChange}
                placeholder="18:00 - 21:00"
              />
              {errors.available_hours ? <small>{errors.available_hours}</small> : null}
            </label>

            {isRegistered ? (
              <label className="deliverer-toggle" htmlFor="is-active">
                <input
                  id="is-active"
                  name="is_active"
                  type="checkbox"
                  checked={formValues.is_active}
                  onChange={handleChange}
                />
                <span>Đang sẵn sàng nhận giao sách</span>
              </label>
            ) : null}

            <div className="deliverer-form-actions">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : submitLabel}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default DelivererProfilePage;

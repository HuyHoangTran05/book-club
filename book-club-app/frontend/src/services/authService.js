import api, { apiPath, clearAuthToken, setAuthToken } from "./api.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function findToken(payload) {
  return (
    payload?.token ||
    payload?.accessToken ||
    payload?.access_token ||
    payload?.jwt ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    payload?.data?.access_token
  );
}

function findUser(payload) {
  return (
    payload?.user ||
    payload?.member ||
    payload?.currentUser ||
    payload?.data?.user ||
    payload?.data?.member ||
    payload?.data?.currentUser ||
    (payload && !findToken(payload) ? payload : null)
  );
}

function normalizeAuthResult(response) {
  const payload = unwrapResponse(response);
  const token = findToken(payload);
  const user = findUser(payload);

  return { token, user, raw: payload };
}

export function getAuthErrorMessage(error, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  const status = error.response.status;
  const serverMessage = String(error.response.data?.message || error.response.data?.error || "").toLowerCase();

  if (status === 401 || status === 403) {
    return "Email hoặc mật khẩu không đúng.";
  }

  if (status === 409 || serverMessage.includes("exist") || serverMessage.includes("used") || serverMessage.includes("duplicate")) {
    return "Email này đã được sử dụng.";
  }

  return fallback;
}

export async function register(payload) {
  const response = await api.post(apiPath("/auth/register"), payload);
  const result = normalizeAuthResult(response);

  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
}

export async function login(payload) {
  const response = await api.post(apiPath("/auth/login"), payload);
  const result = normalizeAuthResult(response);

  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
}

export async function getCurrentUser() {
  const response = await api.get(apiPath("/auth/me"));
  const payload = unwrapResponse(response);

  return findUser(payload) || payload;
}

export function logout() {
  clearAuthToken();
}

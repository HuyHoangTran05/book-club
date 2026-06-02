import api, { apiPath } from "./api.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  const data = body?.data ?? body;

  return data?.user || data?.member || data;
}

function normalizeProfile(profile = {}) {
  return {
    member_id: profile.member_id ?? profile.memberId ?? profile.id ?? "",
    full_name: profile.full_name ?? profile.fullName ?? profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? profile.phone_number ?? profile.phoneNumber ?? "",
    point_balance: profile.point_balance ?? profile.pointBalance ?? profile.points ?? 0,
    role: profile.role ?? "member",
    is_deliverer: profile.is_deliverer ?? profile.isDeliverer ?? false,
    account_status: profile.account_status ?? profile.accountStatus ?? profile.status ?? "active",
    email_verified: profile.email_verified ?? profile.emailVerified ?? false,
    created_at: profile.created_at ?? profile.createdAt ?? "",
    raw: profile,
  };
}

function normalizeProfilePayload(payload = {}) {
  return {
    full_name: payload.full_name ?? payload.fullName ?? "",
    phone: payload.phone ?? "",
  };
}

function normalizePasswordPayload(payload = {}) {
  return {
    current_password: payload.current_password ?? payload.currentPassword ?? "",
    new_password: payload.new_password ?? payload.newPassword ?? "",
    confirm_password: payload.confirm_password ?? payload.confirmPassword ?? "",
  };
}

export async function getMyProfile() {
  const response = await api.get(apiPath("/members/me"));
  return normalizeProfile(unwrapResponse(response));
}

export async function updateMyProfile(payload) {
  const response = await api.put(apiPath("/members/me"), normalizeProfilePayload(payload));
  return normalizeProfile(unwrapResponse(response));
}

export async function changePassword(payload) {
  const response = await api.put(apiPath("/members/me/password"), normalizePasswordPayload(payload));
  return unwrapResponse(response);
}

export function getProfileErrorMessage(error, fallback = "Không thể cập nhật thông tin. Vui lòng thử lại.") {
  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  return error.response.data?.message || error.response.data?.error || fallback;
}

export function getPasswordErrorMessage(error) {
  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  const status = error.response.status;
  const serverMessage = String(error.response.data?.message || error.response.data?.error || "").toLowerCase();

  if (status === 404) {
    return "Chức năng đổi mật khẩu chưa được backend hỗ trợ.";
  }

  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    serverMessage.includes("current") ||
    serverMessage.includes("password") ||
    serverMessage.includes("incorrect") ||
    serverMessage.includes("wrong") ||
    serverMessage.includes("không đúng")
  ) {
    return "Mật khẩu hiện tại không đúng.";
  }

  return error.response.data?.message || error.response.data?.error || "Không thể đổi mật khẩu. Vui lòng thử lại.";
}

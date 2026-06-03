import api, { apiPath } from "./api.js";

function unwrap(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

export function getAdminErrorMessage(error, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  if (error.response.status === 403) {
    return "Bạn không có quyền quản trị để thực hiện thao tác này.";
  }

  return error.response.data?.message || fallback;
}

export async function getAdminStats() {
  const response = await api.get(apiPath("/admin/stats"));
  return unwrap(response);
}

export async function getAdminMembers(params = {}) {
  const response = await api.get(apiPath("/admin/members"), { params });
  return unwrap(response);
}

export async function updateMemberStatus(memberId, accountStatus) {
  const response = await api.put(apiPath(`/admin/members/${memberId}/status`), {
    account_status: accountStatus,
  });
  return unwrap(response);
}

export async function deleteMember(memberId) {
  const response = await api.delete(apiPath(`/admin/members/${memberId}`));
  return unwrap(response);
}

export async function getAdminTransactions(params = {}) {
  const response = await api.get(apiPath("/admin/transactions"), { params });
  return unwrap(response);
}

export async function adminCancelTransaction(transactionId, payload = {}) {
  const response = await api.put(apiPath(`/admin/transactions/${transactionId}/cancel`), payload);
  return unwrap(response);
}

export async function adminForceCompleteTransaction(transactionId, payload = {}) {
  const response = await api.put(
    apiPath(`/admin/transactions/${transactionId}/force-complete`),
    payload,
  );
  return unwrap(response);
}

export async function downloadReport(format = "xlsx") {
  const response = await api.get(apiPath("/reports/summary"), {
    params: { format },
    responseType: "blob",
  });

  const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bao-cao-${new Date().toISOString().slice(0, 10)}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

import api, { apiPath } from "./api.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizeDeliverer(rawDeliverer = {}) {
  return {
    member_id: firstDefined(rawDeliverer.member_id, rawDeliverer.memberId, rawDeliverer.id, ""),
    memberId: firstDefined(rawDeliverer.member_id, rawDeliverer.memberId, rawDeliverer.id, ""),
    full_name: firstDefined(rawDeliverer.full_name, rawDeliverer.fullName, rawDeliverer.name, ""),
    fullName: firstDefined(rawDeliverer.full_name, rawDeliverer.fullName, rawDeliverer.name, ""),
    email: rawDeliverer.email ?? "",
    point_balance: firstDefined(rawDeliverer.point_balance, rawDeliverer.pointBalance, null),
    role: rawDeliverer.role ?? "member",
    is_deliverer: Boolean(firstDefined(rawDeliverer.is_deliverer, rawDeliverer.isDeliverer, true)),
    account_status: rawDeliverer.account_status ?? rawDeliverer.accountStatus ?? "",
    raw: rawDeliverer,
  };
}

export async function getDeliverers() {
  const response = await api.get(apiPath("/deliverers"));
  const payload = unwrapResponse(response);
  const deliverers = payload?.items ?? payload?.deliverers ?? payload;

  return Array.isArray(deliverers) ? deliverers.map(normalizeDeliverer) : [];
}

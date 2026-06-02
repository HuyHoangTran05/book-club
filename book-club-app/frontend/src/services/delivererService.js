import api, { apiPath } from "./api.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizeDeliverer(rawDeliverer = {}) {
  const rawProfile = rawDeliverer.delivererProfile ?? rawDeliverer.deliverer_profile ?? rawDeliverer.profile ?? null;

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
    delivererProfile: rawProfile
      ? {
          profile_id: firstDefined(rawProfile.profile_id, rawProfile.profileId, rawProfile.id, ""),
          member_id: firstDefined(rawProfile.member_id, rawProfile.memberId, rawDeliverer.member_id, ""),
          service_area: firstDefined(rawProfile.service_area, rawProfile.serviceArea, ""),
          serviceArea: firstDefined(rawProfile.service_area, rawProfile.serviceArea, ""),
          available_hours: firstDefined(rawProfile.available_hours, rawProfile.availableHours, ""),
          availableHours: firstDefined(rawProfile.available_hours, rawProfile.availableHours, ""),
          total_deliveries: Number(firstDefined(rawProfile.total_deliveries, rawProfile.totalDeliveries, 0)),
          totalDeliveries: Number(firstDefined(rawProfile.total_deliveries, rawProfile.totalDeliveries, 0)),
          is_active: Boolean(firstDefined(rawProfile.is_active, rawProfile.isActive, true)),
          isActive: Boolean(firstDefined(rawProfile.is_active, rawProfile.isActive, true)),
          raw: rawProfile,
        }
      : null,
    raw: rawDeliverer,
  };
}

export async function getDeliverers() {
  const response = await api.get(apiPath("/deliverers"));
  const payload = unwrapResponse(response);
  const deliverers = payload?.items ?? payload?.deliverers ?? payload;

  return Array.isArray(deliverers) ? deliverers.map(normalizeDeliverer) : [];
}

function toDelivererProfilePayload(payload = {}) {
  return {
    service_area: payload.service_area ?? payload.serviceArea ?? "",
    available_hours: payload.available_hours ?? payload.availableHours ?? "",
    ...(payload.is_active === undefined && payload.isActive === undefined
      ? {}
      : { is_active: payload.is_active ?? payload.isActive }),
  };
}

export async function registerDeliverer(payload) {
  const response = await api.post(apiPath("/deliverers/register"), toDelivererProfilePayload(payload));
  return normalizeDeliverer(unwrapResponse(response));
}

export async function getMyDelivererProfile() {
  const response = await api.get(apiPath("/deliverers/me"));
  const payload = unwrapResponse(response);
  return payload ? normalizeDeliverer(payload) : null;
}

export async function updateMyDelivererProfile(payload) {
  const response = await api.put(apiPath("/deliverers/me"), toDelivererProfilePayload(payload));
  return normalizeDeliverer(unwrapResponse(response));
}

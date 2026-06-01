import api, { apiPath } from "./api.js";

function unwrapBody(response) {
  return response?.data ?? response;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizePointHistoryItem(rawItem = {}) {
  return {
    id: firstDefined(rawItem.id, rawItem.point_history_id, rawItem.pointHistoryId, rawItem.transaction_id, rawItem.created_at),
    transaction_id: firstDefined(rawItem.transaction_id, rawItem.transactionId, rawItem.transaction?.transaction_id, null),
    point_change: Number(firstDefined(rawItem.point_change, rawItem.pointChange, rawItem.change, 0)),
    reason: firstDefined(rawItem.reason, rawItem.description, rawItem.note, "Cập nhật điểm"),
    created_at: firstDefined(rawItem.created_at, rawItem.createdAt, rawItem.time, null),
    raw: rawItem,
  };
}

function normalizePointHistoryResponse(response) {
  const body = unwrapBody(response);
  const payload = body?.data ?? body;
  const items = Array.isArray(payload)
    ? payload
    : payload?.items ?? payload?.history ?? payload?.pointHistory ?? payload?.records ?? [];

  return {
    items: Array.isArray(items) ? items.map(normalizePointHistoryItem) : [],
    currentPoints: firstDefined(
      body?.current_points,
      body?.currentPoints,
      body?.point_balance,
      body?.pointBalance,
      payload?.current_points,
      payload?.currentPoints,
      payload?.point_balance,
      payload?.pointBalance,
      null
    ),
    raw: body,
  };
}

export async function getPointHistory() {
  const response = await api.get(apiPath("/points/history"), {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    params: {
      _t: Date.now(),
    },
  });
  return normalizePointHistoryResponse(response);
}

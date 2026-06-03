import asyncHandler from "../../utils/asyncHandler.js";
import createHttpError from "../../utils/createHttpError.js";
import { successResponse } from "../../utils/response.js";
import adminService from "./admin.service.js";
import { buildSummaryPdf, buildSummaryWorkbook } from "./report.service.js";

export const getStats = asyncHandler(async (_req, res) => {
  const stats = await adminService.getStats();
  successResponse(res, stats, "Lấy thống kê hệ thống thành công");
});

export const listMembers = asyncHandler(async (req, res) => {
  const members = await adminService.listMembers(req.query);
  successResponse(res, members, "Lấy danh sách thành viên thành công");
});

export const updateMemberStatus = asyncHandler(async (req, res) => {
  const member = await adminService.updateMemberStatus(
    req.user.member_id,
    req.params.memberId,
    req.body.account_status ?? req.body.status,
  );
  successResponse(res, member, "Cập nhật trạng thái tài khoản thành công");
});

export const deleteMember = asyncHandler(async (req, res) => {
  const result = await adminService.deleteMember(req.user.member_id, req.params.memberId);
  successResponse(res, result, "Xoá thành viên thành công");
});

export const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await adminService.listTransactions(req.query);
  successResponse(res, transactions, "Lấy danh sách giao dịch thành công");
});

export const downloadSummaryReport = asyncHandler(async (req, res) => {
  const format = String(req.query.format ?? "xlsx").toLowerCase();
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "pdf") {
    const pdf = await buildSummaryPdf();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="bao-cao-${stamp}.pdf"`);
    return res.send(pdf);
  }

  if (format !== "xlsx") {
    throw createHttpError("format chỉ hỗ trợ xlsx hoặc pdf", 400);
  }

  const workbook = await buildSummaryWorkbook();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename="bao-cao-${stamp}.xlsx"`);
  return res.send(workbook);
});

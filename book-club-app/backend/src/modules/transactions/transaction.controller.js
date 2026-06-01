import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import transactionService from "./transaction.service.js";

export const pingTransactions = (req, res) => {
  successResponse(res, null, "transactions module is ready");
};

export const createTransaction = asyncHandler(async (req, res) => {
  const bookTransaction = await transactionService.createTransaction(
    req.user.member_id,
    req.body,
  );
  successResponse(res, bookTransaction, "Tạo giao dịch thành công", 201);
});

export const listMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getMyTransactions(req.user.member_id);
  successResponse(res, transactions, "Lấy danh sách giao dịch của tôi thành công");
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const bookTransaction = await transactionService.getTransactionById(
    req.user.member_id,
    req.params.transactionId,
  );
  successResponse(res, bookTransaction, "Lấy chi tiết giao dịch thành công");
});

export const confirmTransaction = asyncHandler(async (req, res) => {
  const bookTransaction = await transactionService.confirmTransaction(
    req.user.member_id,
    req.params.transactionId,
  );
  successResponse(res, bookTransaction, "Xác nhận giao dịch thành công");
});

export const cancelTransaction = asyncHandler(async (req, res) => {
  const bookTransaction = await transactionService.cancelTransaction(
    req.user.member_id,
    req.params.transactionId,
  );
  successResponse(res, bookTransaction, "Hủy giao dịch thành công");
});

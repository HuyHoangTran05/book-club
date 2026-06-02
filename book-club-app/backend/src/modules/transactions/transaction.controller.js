import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import transactionService from "./transaction.service.js";

export const pingTransactions = (req, res) => {
  successResponse(res, null, "transactions module is ready");
};

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(
    req.user.member_id,
    req.body,
  );
  successResponse(res, transaction, "Transaction created", 201);
});

export const confirmTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.confirmTransaction(
    req.user.member_id,
    req.params.transactionId,
  );
  successResponse(res, transaction, "Transaction confirmed");
});

export const cancelTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.cancelTransaction(
    req.user.member_id,
    req.params.transactionId,
  );
  successResponse(res, transaction, "Transaction cancelled");
});

export const getMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.listMyTransactions(req.user.member_id);
  successResponse(res, transactions, "My transactions");
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(
    req.params.transactionId,
    req.user.member_id,
  );
  successResponse(res, transaction, "Transaction detail");
});

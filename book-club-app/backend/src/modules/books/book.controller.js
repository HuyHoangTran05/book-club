import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import bookService from "./book.service.js";

export const pingBooks = (req, res) => {
  successResponse(res, null, "books module is ready");
};

export const createBook = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    ...(req.file ? { cover_url: `/uploads/book-covers/${req.file.filename}` } : {}),
  };
  const book = await bookService.createBook(req.user.member_id, payload);
  successResponse(res, book, "Thêm sách thành công", 201);
});

export const listBooks = asyncHandler(async (req, res) => {
  const books = await bookService.getAvailableBooks(req.query);
  successResponse(res, books, "Lấy danh sách sách thành công");
});

export const listMyBooks = asyncHandler(async (req, res) => {
  const books = await bookService.getMyBooks(req.user.member_id);
  successResponse(res, books, "Lấy danh sách sách của tôi thành công");
});

export const getBookByCopyId = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.copyId);
  successResponse(res, book, "Lấy chi tiết sách thành công");
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(
    req.user.member_id,
    req.params.copyId,
    req.body,
  );
  successResponse(res, book, "Cập nhật sách thành công");
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await bookService.deleteBook(req.user.member_id, req.params.copyId);
  successResponse(res, book, "Đã ẩn sách thành công");
});

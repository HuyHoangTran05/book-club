import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import bookService from "./book.service.js";

export const pingBooks = (req, res) => {
  successResponse(res, null, "books module is ready");
};

export const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.user.member_id, req.body);
  successResponse(res, book, "Book created", 201);
});

export const listBooks = asyncHandler(async (req, res) => {
  const books = await bookService.listBooks(req.query);
  successResponse(res, books, "Book list");
});

export const listMyBooks = asyncHandler(async (req, res) => {
  const books = await bookService.listMyBooks(req.user.member_id, req.query);
  successResponse(res, books, "My book list");
});

export const getBookByCopyId = asyncHandler(async (req, res) => {
  const book = await bookService.getBookByCopyId(req.params.copyId);
  successResponse(res, book, "Book detail");
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(
    req.user.member_id,
    req.params.copyId,
    req.body,
  );
  successResponse(res, book, "Book updated");
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await bookService.deleteBook(req.user.member_id, req.params.copyId);
  successResponse(res, book, "Book marked as unavailable");
});

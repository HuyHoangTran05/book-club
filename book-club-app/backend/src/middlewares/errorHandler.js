const errorHandler = (err, req, res, next) => {
  const isMulterError = err.name === "MulterError";
  const statusCode = err.statusCode || (isMulterError ? 400 : 500);
  const message = err.code === "LIMIT_FILE_SIZE"
    ? "Ảnh bìa không được vượt quá 5MB"
    : err.message;

  const response = {
    success: false,
    message: message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;

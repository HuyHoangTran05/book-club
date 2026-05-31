import jwt from "jsonwebtoken";
import createHttpError from "../utils/createHttpError.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError("Not authorized, no token", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(createHttpError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(createHttpError("Not authorized, token failed", 401));
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(createHttpError("Forbidden: insufficient role", 403));
  }

  return next();
};

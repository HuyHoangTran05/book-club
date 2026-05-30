import jwt from "jsonwebtoken";
import createHttpError from "../utils/createHttpError.js";

const getBearerToken = (authHeader) => {
  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const protect = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return next(createHttpError("JWT_SECRET is not configured", 500));
  }

  const token = getBearerToken(req.headers.authorization);

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

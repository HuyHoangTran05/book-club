import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import createHttpError from "../utils/createHttpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.join(__dirname, "../../uploads");
const bookCoverUploadDir = path.join(uploadRoot, "book-covers");
const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

fs.mkdirSync(bookCoverUploadDir, { recursive: true });

const sanitizeFilename = (filename) => {
  const parsed = path.parse(filename);
  const safeName = parsed.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_.]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${safeName || "book-cover"}${parsed.ext.toLowerCase()}`;
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, bookCoverUploadDir);
  },
  filename: (_req, file, callback) => {
    callback(null, `cover-${Date.now()}-${sanitizeFilename(file.originalname)}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (!allowedImageMimeTypes.includes(file.mimetype)) {
    callback(createHttpError("Ảnh bìa chỉ hỗ trợ JPG, PNG hoặc WEBP", 400));
    return;
  }

  callback(null, true);
};

export const uploadBookCover = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
});

export default uploadBookCover;

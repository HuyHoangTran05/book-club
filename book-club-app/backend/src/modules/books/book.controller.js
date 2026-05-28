import { successResponse } from "../../utils/response.js";

export const pingBooks = (req, res) => {
  successResponse(res, null, "books module is ready");
};

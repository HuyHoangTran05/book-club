import { successResponse } from "../../utils/response.js";

export const pingPoints = (req, res) => {
  successResponse(res, null, "points module is ready");
};

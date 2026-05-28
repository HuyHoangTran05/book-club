import { successResponse } from "../../utils/response.js";

export const pingAuth = (req, res) => {
  successResponse(res, null, "auth module is ready");
};

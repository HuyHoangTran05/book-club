import { successResponse } from "../../utils/response.js";

export const pingTransactions = (req, res) => {
  successResponse(res, null, "transactions module is ready");
};

import { Member } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const delivererAttributes = [
  "member_id",
  "full_name",
  "email",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
];

const handleDatabaseNotReady = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*members.* does not exist/i.test(error.message)
  ) {
    throw createHttpError("Bảng members chưa sẵn sàng. Vui lòng chạy migration trước.", 501);
  }

  throw error;
};

const withDatabaseGuard = async (callback) => {
  try {
    return await callback();
  } catch (error) {
    handleDatabaseNotReady(error);
  }
};

const sanitizeDeliverer = (deliverer) => {
  const plainDeliverer = typeof deliverer.get === "function"
    ? deliverer.get({ plain: true })
    : { ...deliverer };

  delete plainDeliverer.password_hash;
  return plainDeliverer;
};

const listDeliverers = async () => withDatabaseGuard(async () => {
  const deliverers = await Member.findAll({
    where: {
      is_deliverer: true,
      account_status: "active",
    },
    attributes: delivererAttributes,
    order: [["full_name", "ASC"]],
  });

  return deliverers.map(sanitizeDeliverer);
});

const delivererService = {
  listDeliverers,
};

export default delivererService;

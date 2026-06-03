import { Member, DelivererProfile, sequelize } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";
import notificationService from "../notifications/notification.service.js";

const delivererAttributes = [
  "member_id",
  "full_name",
  "email",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
];

const delivererProfileAttributes = [
  "profile_id",
  "member_id",
  "service_area",
  "available_hours",
  "total_deliveries",
  "is_active",
  "created_at",
  "updated_at",
];

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const handleDatabaseNotReady = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*(members|deliverer_profiles).* does not exist/i.test(error.message)
  ) {
    throw createHttpError("Bảng người giao sách chưa sẵn sàng. Vui lòng chạy migration trước.", 501);
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

const sanitizeMyProfile = (member) => {
  if (!member) {
    return null;
  }

  return sanitizeDeliverer(member);
};

const listDeliverers = async () => withDatabaseGuard(async () => {
  const deliverers = await Member.findAll({
    where: {
      is_deliverer: true,
      account_status: "active",
    },
    attributes: delivererAttributes,
    include: [
      {
        model: DelivererProfile,
        as: "delivererProfile",
        attributes: delivererProfileAttributes,
        required: false,
      },
    ],
    order: [["full_name", "ASC"]],
  });

  return deliverers
    .map(sanitizeDeliverer)
    .filter((deliverer) => !deliverer.delivererProfile || deliverer.delivererProfile.is_active);
});

const getMyProfile = async (memberId) => withDatabaseGuard(async () => {
  const member = await Member.findByPk(memberId, {
    attributes: delivererAttributes,
    include: [
      {
        model: DelivererProfile,
        as: "delivererProfile",
        attributes: delivererProfileAttributes,
        required: false,
      },
    ],
  });

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  const plainMember = sanitizeMyProfile(member);

  if (!plainMember?.is_deliverer && !plainMember?.delivererProfile) {
    return null;
  }

  return plainMember;
});

const upsertMyProfile = async (
  memberId,
  payload = {},
  { defaultActive = true, requireProfileFields = true } = {},
) => withDatabaseGuard(async () => {
  const serviceArea = normalizeText(payload.service_area ?? payload.serviceArea);
  const availableHours = normalizeText(payload.available_hours ?? payload.availableHours);

  if (requireProfileFields && !serviceArea) {
    throw createHttpError("service_area is required", 400);
  }

  if (requireProfileFields && !availableHours) {
    throw createHttpError("available_hours is required", 400);
  }

  const hasServiceArea = Object.prototype.hasOwnProperty.call(payload, "service_area") ||
    Object.prototype.hasOwnProperty.call(payload, "serviceArea");
  const hasAvailableHours = Object.prototype.hasOwnProperty.call(payload, "available_hours") ||
    Object.prototype.hasOwnProperty.call(payload, "availableHours");
  const hasIsActive = Object.prototype.hasOwnProperty.call(payload, "is_active") ||
    Object.prototype.hasOwnProperty.call(payload, "isActive");

  if (!requireProfileFields && !hasServiceArea && !hasAvailableHours && !hasIsActive) {
    throw createHttpError("No valid deliverer profile fields to update", 400);
  }

  if (hasServiceArea && !serviceArea) {
    throw createHttpError("service_area is required", 400);
  }

  if (hasAvailableHours && !availableHours) {
    throw createHttpError("available_hours is required", 400);
  }

  const requestedIsActive = payload.is_active ?? payload.isActive;
  const isActive = requestedIsActive === undefined ? defaultActive : Boolean(requestedIsActive);

  let createdNew = true;

  await sequelize.transaction(async (transaction) => {
    const member = await Member.findByPk(memberId, { transaction });

    if (!member) {
      throw createHttpError("Member not found", 404);
    }

    await member.update(
      {
        is_deliverer: true,
      },
      { transaction },
    );

    const existingProfile = await DelivererProfile.findOne({
      where: {
        member_id: memberId,
      },
      transaction,
    });

    if (existingProfile) {
      const updates = {};

      if (hasServiceArea) {
        updates.service_area = serviceArea;
      }

      if (hasAvailableHours) {
        updates.available_hours = availableHours;
      }

      if (hasIsActive) {
        updates.is_active = isActive;
      }

      await existingProfile.update(
        updates,
        { transaction },
      );
      createdNew = false;
      return;
    }

    if (!serviceArea) {
      throw createHttpError("service_area is required", 400);
    }

    if (!availableHours) {
      throw createHttpError("available_hours is required", 400);
    }

    await DelivererProfile.create(
      {
        member_id: memberId,
        service_area: serviceArea,
        available_hours: availableHours,
        total_deliveries: 0,
        is_active: isActive,
      },
      { transaction },
    );
  });

  await notificationService.createNotification({
    member_id: memberId,
    type: "system",
    content: createdNew
      ? "Bạn đã đăng ký làm người giao sách miễn phí."
      : "Bạn đã cập nhật hồ sơ người giao sách.",
  });

  return getMyProfile(memberId);
});

const delivererService = {
  listDeliverers,
  getMyProfile,
  upsertMyProfile,
};

export default delivererService;

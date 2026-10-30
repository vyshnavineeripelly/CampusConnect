const User = require("../models/User");
const Notification = require("../models/Notification");

const createNotification = async ({
  recipientId,
  actorId,
  type,
  message,
  relatedType,
  relatedId,
}) => {
  try {
    if (!recipientId || !actorId || recipientId.toString() === actorId.toString()) {
      return null;
    }

    const recipient = await User.findById(recipientId).select(
      "notificationPreferences"
    );

    if (recipient?.notificationPreferences?.inApp === false) {
      return null;
    }

    return await Notification.create({
      recipient: recipientId,
      actor: actorId,
      type,
      message,
      relatedType,
      relatedId,
    });
  } catch (error) {
    console.error("Notification creation error:", error.message);
    return null;
  }
};

module.exports = { createNotification };

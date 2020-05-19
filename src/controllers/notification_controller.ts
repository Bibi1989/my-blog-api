const models = require("../../database/models/");

const { User, Notification } = models;

interface NoticeInterface {
  message: string;
  userId: number;
}

export const createNotification = async (notices: NoticeInterface) => {
  try {
    const notice = await Notification.create({
      ...notices,
    });
    return { status: "success", notice };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getNotifications = async (userId: number) => {
  try {
    const notices = await Notification.findAll({
      where: {
        userId,
      },
      include: [User],
    });
    return { status: "success", notices };
  } catch (error) {
    return { status: "error", error };
  }
};
export const deleteNotification = async (id: number) => {
  try {
    const notices = await Notification.destroy({
      where: {
        id,
      },
    });
    return { status: "success", notices };
  } catch (error) {
    return { status: "error", error };
  }
};

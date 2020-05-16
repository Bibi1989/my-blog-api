const models = require("../../database/models/");

const { User, Url, History } = models;

interface historyInterface {
  title: string;
  link: string;
  userId?: number;
}

export const createHistory = async (history: historyInterface, id: number) => {
  try {
    const histories = await History.create({
      ...history,
      userId: Number(id),
    });
    return { status: "success", data: histories };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
};

export const getHistories = async () => {
  try {
    const histories = await History.findAll({
      include: [User],
    });
    return { status: "success", data: histories };
  } catch (error) {
    return { status: "error", error };
  }
};

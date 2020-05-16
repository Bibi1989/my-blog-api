"use strict";
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      message: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {}
  );
  Notification.associate = function (models) {
    Notification.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Notification;
};

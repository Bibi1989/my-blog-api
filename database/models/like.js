"use strict";
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      username: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {}
  );
  Like.associate = function (models) {
    Like.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Like.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
  };
  return Like;
};

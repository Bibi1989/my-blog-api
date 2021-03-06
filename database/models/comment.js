"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      message: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {}
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
  };
  return Comment;
};

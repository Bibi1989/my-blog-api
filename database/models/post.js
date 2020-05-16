"use strict";
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.STRING,
      message: DataTypes.STRING,
      tags: DataTypes.STRING,
      track: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
    },
    {}
  );
  Post.associate = function (models) {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
  };
  return Post;
};

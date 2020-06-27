"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpired: DataTypes.DATE,
      image_url: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Post, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Like, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Notification, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return User;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    uuid: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
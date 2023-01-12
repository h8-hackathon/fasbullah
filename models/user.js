'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post)
      User.hasMany(models.Friendship)
      User.hasMany(models.Comment)
      User.hasOne(models.Credential)
    }
  }
  User.init({
    name: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    coverPhoto: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
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
      User.belongsToMany(models.User, { through: models.Friendship, as: 'Requester', foreignKey: 'RequesterId' })
      User.belongsToMany(models.User, { through: models.Friendship, as: 'Requested', foreignKey: 'RequestedId' })
      User.hasMany(models.Comment)
      User.hasOne(models.Credential)
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        }
      }
    },
    profilePicture: DataTypes.STRING,
    coverPhoto: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(user) {
        if(!user.profilePicture) {
          user.profilePicture = 'https://i.postimg.cc/4yw2JvYm/default-propic.jpg'
        }
        if(!user.coverPhoto) {
          user.coverPhoto = 'https://i.postimg.cc/nVkns67Q/giga-1.jpg'
        }
      }
    }
  });
  return User;
};
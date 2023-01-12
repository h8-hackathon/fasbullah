'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

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

        return bcrypt.genSalt(10)
          .then(salt => {
            return bcrypt.hash(user.password, salt);
          })
          .then(hashPassword => {
            user.password = hashPassword;
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  });
  return User;
};
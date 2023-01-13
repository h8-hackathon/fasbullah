'use strict';
const { imgbox } = require('imgbox');
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


    static upload(files) {
      return new Promise((resolve, reject) => {
        const { profile, cover } = files

        let listToUpload = []

        if (profile) {
          listToUpload.push({ filename: profile[0].originalname, buffer: profile[0].buffer})
        }

        if (cover) {
          listToUpload.push({ filename: cover[0].originalname, buffer: cover[0].buffer})
        }

        imgbox(listToUpload)
          .then(response => {
            if (!response.ok) return resolve(null)
            
            let data = { profilePicture: null, coverPhoto: null }

            if (profile) {
              data.profilePicture = response.files.find(file => file.name === profile[0].originalname).original_url
            }

            if (cover) {
              data.coverPhoto = response.files.find(file => file.name === cover[0].originalname).original_url
            }

            resolve(data)
          })

      })
      
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
      },
      beforeUpdate(user) {
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
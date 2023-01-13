'use strict'
const { Model } = require('sequelize')
const { timeSince } = require('../helpers')
const { Op } = require('sequelize')
const { imgbox } = require('imgbox')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.hasMany(models.Comment)
      Post.belongsToMany(models.Tag, { through: models.PostTags })
    }

    get timeSincePost() {
      return timeSince(this.createdAt)
    }

    static getTimeLinePosts(otherUserIds, offset, limit, User) {
      return this.findAll({
        where: {
          UserId: {
            [Op.in]: otherUserIds,
          },
        },
        include: User,
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      })
    }

    static uploadImage(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null)
        } else {
          const { buffer } = file
          imgbox(buffer)
            .then((response) => {
              if (!response.ok) return resolve(null)
              return resolve(response.files[0].original_url)
            })
            .catch((err) => {
              console.log(err)
              resolve(null)
            })
        }
      })
    }
  }
  Post.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      post: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [1, 1000],
            msg: 'Post can only be between 1 - 1000',
          },
          notEmpty: {
            msg: 'Post cannot be empty',
          },
        },
      },
      imageURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  )
  return Post
}

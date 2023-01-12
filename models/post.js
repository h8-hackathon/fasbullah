'use strict';
const {
  Model
} = require('sequelize');
const { timeSince } = require('../helpers');
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
      Post.hasMany(models.PostTags)
    }

    get timeSincePost() {
      return timeSince(this.createdAt)
    }

    static getTimeLinePosts(otherUserIds, offset, limit) {
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
  }
  Post.init({
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    post: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 1000],
          msg: 'Post can only be between 1 - 1000'
        },
        notEmpty: {
          msg: 'Post cannot be empty'
        },
      }
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
    
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
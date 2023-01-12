'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User)
      Comment.belongsTo(models.Post)
    }
  }
  Comment.init({
    PostId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 1000],
          msg: 'Comment length can only be between 1-1000 character'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
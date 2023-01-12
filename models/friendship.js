'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friendship.belongsTo(models.User, { foreignKey: 'RequesterId' })
      Friendship.belongsTo(models.User, { foreignKey: 'RequestedId' })
    }
  }
  Friendship.init({
    RequesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    RequestedId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Friendship',
    hooks: {
      beforeCreate(friendship, options) {
        return new Promise((resolve, reject) => {
          Friendship.findOne({
            where: {
              RequesterId: friendship.RequesterId,
              RequestedId: friendship.RequestedId,
            },
          })
          .then(founded => {
            if(founded) return reject('Already exist')

            return Friendship.findOne({
              where: {
                RequesterId: friendship.RequestedId,
                RequestedId: friendship.RequesterId,
              },
            })
          })
          .then(founded => {
            if(founded) return reject('Already exist')
            resolve()
          })
          .catch(reject)

        })
      }
    }
  });
  return Friendship;
};
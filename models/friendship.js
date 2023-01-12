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
      Friendship.belongsTo(models.User)
    }

    static isMyFriend(userId, friendId) {
      return new Promise((resolve, reject) => {
        Friendship
          .findOne({
            where: {
              RequesterId: userId,
              RequestedId: friendId
            },
            attributes: ['isConfirmed']
          })
          .then(friendship => {
            if(friendship) return resolve(friendship.isConfirmed? 'friend' : 'pending')
            return Friendship
              .findOne({
                where: {
                  RequesterId: friendId,
                  RequestedId: userId
                },
                attributes: ['isConfirmed']
              })
          })
          .then(friendship => {
            if(friendship) return resolve(friendship.isConfirmed? 'friend' : 'need-accept')
            return resolve(false)
          })
          .catch(err => reject(err))
      })
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
      defaultValue: false
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
            attributes: ['id']
          })
          .then(founded => {
            if(founded) return reject('Already exist')
            
            return Friendship.findOne({
              where: {
                RequesterId: friendship.RequestedId,
                RequestedId: friendship.RequesterId,
              },
              attributes: ['id']
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
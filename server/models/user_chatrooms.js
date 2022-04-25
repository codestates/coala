'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_chatrooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      this.belongsTo(models.chatrooms, {
        foreignKey: 'chatroomId',
        sourceKey: 'id',
      });
    }
  }
  user_chatrooms.init(
    {
      userId: DataTypes.INTEGER,
      chatroomId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'user_chatrooms',
    },
  );
  return user_chatrooms;
};

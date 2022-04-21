'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contents.init(
    {
      user_id: DataTypes.INTEGER,
      content_name: DataTypes.STRING,
      content_body: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'contents',
    },
  );
  return contents;
};
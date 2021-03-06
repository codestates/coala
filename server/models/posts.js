'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: 'userId', // posts 의 userId
        sourceKey: 'id',
        as: 'userInfo',
      });
      this.hasMany(models.like, {
        foreignKey: 'postId',
        sourceKey: 'id',
        as: 'likers',
      });
      this.hasMany(models.post_comment, {
        foreignKey: 'postId',
        sourceKey: 'id',
        as: 'comments',
      });
      this.hasMany(models.chattings, {
        foreignKey: 'chatroomId',
        sourceKey: 'id',
      });
    }
  }
  posts.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stack: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      done: { type: DataTypes.BOOLEAN, defaultValue: 0 },
      in: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'posts',
    },
  );
  return posts;
};

/**
 * @swagger
 *  components:
 *    schemas:
 *      Post:
 *        type: object
 *        required:
 *          - userId
 *          - title
 *          - content
 *          - thumbnail
 *          - description
 *          - stack
 *          - done
 *          - in
 *        properties:
 *          userId:
 *            type: integer
 *          title:
 *            type: string
 *          content:
 *            type: text
 *          thumbnail:
 *            type: string
 *          description:
 *            type: string
 *          stack:
 *            type: string
 *          done:
 *            type: boolean
 *          in:
 *            type: boolean
 */

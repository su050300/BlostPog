"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
        foreignKeyConstraint: true,
      });
      this.hasMany(models.blogs, {
        as: "blogs",
        foreignKey: "authorId",
        foreignKeyConstraint: true,
      });
      // this.hasMany(models.Follower, {
      //   as: "followers",
      //   foreignKey: "followingId",
      //   foreignKeyConstraint: true,
      // });
      // this.hasMany(models.Follower, {
      //   as: "following",
      //   foreignKey: "followerId",
      //   foreignKeyConstraint: true,
      // });
    }
    // toJSON(){
    //   return {...this.get(),id:undefined};
    // }
  }
  Profile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 10,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "profile",
      modelName: "Profile",
    }
  );
  return Profile;
};

const Sequelize = require('sequelize');
const sequelize = require('../db_connect');

const User = sequelize.define('user',{
  id:{
      type:Sequelize.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
  },
  userName:{
      type:Sequelize.STRING,
      allowNull:false
  },
  email:{
      type:Sequelize.STRING,
      allowNull:false,
      validate:{
          isEmail:true,
      }
  }
});

module.exports = User;
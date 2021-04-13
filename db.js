const { Sequelize, DataTypes, Model } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'restaurants.sqlite'),
});

 module.exports = { sequelize, DataTypes, Model };
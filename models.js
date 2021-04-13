const { sequelize, DataTypes, Model } = require("./db");

const options = { sequelize, timestamps: false };

class Restaurant extends Model {}

Restaurant.init(
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  options
);

class Menu extends Model {}

Menu.init(
  {
    title: DataTypes.STRING,
  },
  options
);

class Item extends Model {}

Item.init(
  {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
  },
  options
);

Restaurant.hasMany(Menu, { as: "menus", foreignKey: "restaurant_id" });
Menu.belongsTo(Restaurant, { foreignKey: "restaurant_id" });
Menu.hasMany(Item, { as: "items", foreignKey: "menu_id" });
Item.belongsTo(Menu, { foreignKey: "menu_id" });

module.exports = { Restaurant, Menu, Item };

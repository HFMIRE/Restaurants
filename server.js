const express = require("express");
const expressHandlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const { Restaurant, Menu, Item } = require("./models");
const populateDB = require("./populateDB");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const handlebars = expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});
const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

// retrieve restaurants data to home html
app.get("/", async (req, res) => {
  // showing all restaurants that we have & including their menu and item
  const restaurants = await Restaurant.findAll({
    include: [
      {
        model: Menu,
        as: "menus",
        include: [{ model: Item, as: "items" }],
      },
    ],
    nest: true,
  });
  res.render("home", { restaurants });
});

// retrive data from restaurant about the items on the menu - to display on hmtl
app.get("/restaurants/:id", async (req, res) => {
  // look in the restaurant class in find by id - specificy the parameter as id
  const restaurant = await Restaurant.findByPk(req.params.id);
  // menu retrives a the menu which included the items
  const menus = await restaurant.getMenus({
    include: [{ model: Item, as: "items" }],
    nest: true,
  });
  res.render("restaurant", { restaurant, menus });
});

// creating new routes - connecting to new handlebar
app.get("/new", async (req, res) => {
  res.render("new");
});

// data will posted to the restaurants
app.post("/restaurants", async (req, res) => {
  console.log(req.body); // this is the user input for add restaurant
  // add the new row to restaurant database using user input
  await Restaurant.create(req.body);

  res.redirect("/");
});
// used a get to retrive the data via a a tag
app.get("/restaurants/:id/delete", (req, res) => {
  // sort the restaurant by id, then destroyes the content
  Restaurant.findByPk(req.params.id).then((restaurant) => {
    restaurant.destroy(req.body);
    // redirect to another url and show that page
    res.redirect("/");
  });
});
//
app.get("/restaurants/:id/edit", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  res.render("edit", { restaurant });
});

app.post("/restaurants/", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  console.log(req.body);
  await Restaurant.update(req.body);
  console.log(await Restaurant.update(req.body));
  res.redirect(`/restaurants/${restaurant.id}`);
});
// intialise expresss to listen to port 3000
app.listen(port, async () => {
  const restaurants = await Restaurant.findAll();
  if (restaurants.length === 0) {
    populateDB();
  }
  console.log(`Server listening at http://localhost:${port}`);
});

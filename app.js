
const express = require("express");
// require mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;
const _ = require('lodash');
const port = 3000;

const app = express();
// ejs
app.set('view engine', 'ejs');

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public folder
app.use(express.static("public"));

// creo base de datos dentro de mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
// Create a item Schema
const itemSchema = new Schema({
    name: String
});
// Create an Item Model
const Item = mongoose.model("Item", itemSchema);
// Create a list Schema
const listSchema = new Schema({
   name: String,
   items: [itemSchema]    // relationship and embedding document of itemSchema to items
});
// Create a Work Model
const List = mongoose.model("List", listSchema);

// Create documents
const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "Hit the checkbox is to delete an item"
});
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res){
    //Read from your database
    Item.find()
        .then(function(foundItems){
            if (foundItems.length === 0) {   // foundItems is an array, so to check if the array is empty we use the length
                Item.insertMany(defaultItems)
                    .then(function(){
                        console.log("Successfully saved default items");
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                res.redirect("/");
            } else {
                res.render('list', { listTitle: "Today", newListItems: foundItems });
            }
        })
        .catch(function(err){
            console.log(err);
        });
});

app.get('/:customListName', function(req, res){
  const customListName = _.lowerCase(req.params.customListName);
  List.findOne({name: customListName})
         .then(function(foundList){ // foundItems is an array, so to check if the array is empty we use the length
           if (!foundList) {
            // create a new list
             console.log("Does not exist");
             const list = new List({
               name: customListName,
               items: defaultItems   // embedding itemSchema to listSchema items
             });
             list.save();
             res.redirect("/" + customListName);
         }
         else { // show an existing list
             console.log("List found");
            res.render('list', {listTitle: _.upperFirst(foundList.name), newListItems: foundList.items});
         }
         }).catch(function(err){
            console.log(err);
   });


});

//Sending the about.ejs file to the browser as soon as a request is made on localhost:3000 to local route localhost:3000/about
app.get('/about', function(req, res){
  res.render('about');
});

// post request "/"
app.post("/", (req, res) => {
    const itemName = req.body.newItem;

      const item = new Item ({
          name: itemName
      });
      item.save();
      res.redirect("/");
});
app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox.trim();
  //  console.log(checkedItemId);
    Item.findByIdAndRemove(checkedItemId)
    .then(() => {
        console.log("Succesfully deleted checked item from the database");
        res.redirect("/");
    }).catch((err) => {
        console.log(err);
    })
});

app.listen(3000, () => {
    console.log("Server started on port 3000");

});

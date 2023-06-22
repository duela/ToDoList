// we are requiring our 2 packages installed
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// using __dirname + filename because the module is local and not installed through npm
const date = require(__dirname + "/date.js");
const _ = require('lodash');
const mongoose = require('mongoose');

const port = 3000;
const ejs = require('ejs');
let addLists = [];
let workItems = [];
// set app view engine to ejs : always plca eit below the declaration
app.set('view engine', 'ejs');
app.use(express.static('public'));

main().catch(err => console.log(err));
 async function main(){
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  await mongoose.connect('mongodb://127.0.0.1:27017/itemsDB');
}
  //create a new items SCHEMA that sets out the fields each document will have and their datatypes for items
  const itemsSchema = new mongoose.Schema(
    {
    name: String
  });

  //create a MODEL with collectetion name as first parameter
   const Item = mongoose.model('Item', itemsSchema); // mongoose convert the singular string collection in the query to plural form e.g item -> items
   // The Item has to stick to the structure specified in the schema
  //create item DOCUMENT
   const item1 = new Item(
     {
       name: 'List 1'
     });

   const item2 = new Item(
     {
     name: 'List 2'
   });

   const item3 = new Item({
     name: 'List 3'
   });

   const listItems = [item1, item2, item3];

   // Item.insertMany(listItems).then(function(){
   //   console.log("Sucessfully saved all the items to ItemsDB");
   // }).catch(function(err) {
   //   console.log(err);
   // });
   Item.find({}).then(function(res){
     res.forEach(function(itemInDB) {
       const addList = itemInDB.name;
       //console.log(addList);
       addLists.push(addList);
     });
   });

// to retrieve parsed data from browser to server
app.use(bodyParser.urlencoded({extended:true}));

// creating the first get root to send the user Hello when the user access the home root
app.get('/', function(req, res) {
  const day = date.getDay();
  if (addLists.length === 0) {
    Item.insertMany(listItems).then(function(){
      console.log("Sucessfully saved all the items to ItemsDB");

    }).catch(function(err) {
      console.log(err);
    });

    res.redirect('/')
  }
  else {
    res.render('index', {listTitle: day, newLists: addLists});
  }

  //res.send('Hello');  // res.send parse data from the server to the browser, allowing us to perform logic on how server
});
app.post('/', function(req, res){
  var item = req.body.newList;
  var item = _.capitalize(item);
  if (req.body.list === "Work List") {
    const itemWorkList = new Item({
      name: item
    });
    itemWorkList.save();
    workItems.push(item);
    res.redirect('/work');
  }
  else {
    const itemAddList = new Item({
      name : item
    });
    itemAddList.save();
    addLists.push(item);
    res.redirect('/');
  }
});

//tap into the post req data in index.ejs to req checkbox name: deleteList
app.post('/delete', function(req, res){
  // To push value from the name deleteList and postText in index.ejs into checkedListName
  const checkedListName = req.body.deleteList.trim();
  console.log(checkedListName);
  Item.findByIdAndRemove(checkedListName).then(function(){
    console.log(checkedListName + 'Successfully deleted');
    res.redirect('/');
  }).catch(function() {
    console.log('Error');
  });
});

//Sending the index.ejs file to the browser as soon as a request is made on localhost:3000 to local route localhost:3000/work
app.get('/work', function(req,res){
  res.render('index', {listTitle: "Work List", newLists: workItems});
});

//Sending the about.ejs file to the browser as soon as a request is made on localhost:3000 to local route localhost:3000/about
app.get('/about', function(req, res){
  res.render('about');
});

// We listen on prot 300 and console log the message
app.listen(port, function(){
  console.log("server is now connected to port: " + port);
});





















// Old code

// const express = require("express");
// // require mongoose
// const mongoose = require("mongoose");
// const { Schema } = mongoose;
//
// const app = express();
// // ejs
// app.set('view engine', 'ejs');
//
// // bodyparser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
//
// // public folder
// app.use(express.static("public"));
//
// // creo base de datos dentro de mongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
// // Create a Schema
// const itemSchema = new Schema({
//     name: String
// });
// const workSchema = new Schema({
//   name: String
// });
// // Create a Model
// const Item = mongoose.model("Item", itemSchema);
// const Work = mongoose.model('Work', workSchema);
//
// // Create documents
// const item1 = new Item({
//     name: "Welcome to your todolist!"
// });
// const item2 = new Item({
//     name: "Hit the + button to add a new item"
// });
// const item3 = new Item({
//     name: "<-- Hit this to delete an item"
// });
// const defaultItems = [item1, item2, item3];
//
// const work1 = new Work({
//   name: "Prepare weekly reports"
// });
//
// // post request "/"
// app.post("/", (req, res) => {
//     const itemName = req.body.newItem;
//     const workName = req.body.newItem
//     if (req.body.item === " Today") {
//       const item = new Item ({
//           name: itemName
//       });
//       item.save();
//       res.redirect("/");
//     }
//     else {
//       const work = new Work ({
//           name: workName
//       });
//       work.save();
//       res.redirect("/");
//     }
// });
//
// app.get("/", (req, res) => {
//     //Read from your database
//     Item.find()
//         .then((foundItems) => {
//             if (foundItems.length === 0) {
//                 Item.insertMany(defaultItems)
//                     .then(() => {
//                         console.log("Successfully saved default items");
//                     })
//                     .catch((err) => {
//                         console.log(err);
//                     });
//                 res.redirect("/");
//             } else {
//                 res.render('list', { listTitle: "Today", newListItems: foundItems });
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//         });
//
// });
//
// app.get("/work", (req, res) => {
//   Work.find()
//       .then((workItems) => {
//           if (workItems.length === 0) {
//               Work.insertMany(work1)
//                   .then(() => {
//                       console.log("Successfully saved default items");
//                   })
//                   .catch((err) => {
//                       console.log(err);
//                   });
//               res.redirect("/work");
//           } else {
//               res.render('list', { listTitle: "Work List", newListItems: workItems });
//           }
//       })
//       .catch((err) => {
//           console.log(err);
//       });
//     res.render('index', { listTitle: "Work List", newListItems: workItems })
// });
//
//
// app.post("/delete",function(req,res){
//     const checkedItemId = req.body.checkbox.trim();
//
//     Item.findByIdAndRemove(checkedItemId)
//     .then(() => {
//         console.log("Succesfully deleted checked item from the database");
//         res.redirect("/");
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// });
// //list port 3000
// app.listen(3000, () => {
//     console.log("Server started on port 3000");
//
// });

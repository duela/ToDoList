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
       name: 'Buy food'
     });

   const item2 = new Item(
     {
     name: 'Cook food'
   });

   const item3 = new Item({
     name: 'Eat food'
   });

   const listItems = [item1, item2, item3];

   // Item.insertMany(listItems).then(function(){
   //   console.log("Seucessfully saved all the items to ItemsDB");
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
  const day = date.getDay()
  res.render('index', {listTitle: day, newLists: addLists});
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
//Sending the index.ejs file to the browser as soon as a request is made on localhost:3000 to local route localhost:3000/work
app.get('/work', function(req,res){
  res.render('index', {listTitle: "Work List", newLists: workItems});
});

//Sending the about.ejs file to the browser as soon as a request is made on localhost:3000 to local route localhost:3000/about
app.get('/about', function(req, res){
  res.render('about');
})



// We listen on prot 300 and console log the message
app.listen(port, function(){
  console.log("server is now connected to port: " + port);
});


//inside the call back we use res.render and ahe index
// using if else statement
// if (currentDay === 1){
//   day = "Monday";
// }
// else if (currentDay === 2) {
//   day = "Tuesday";
// }
// else if (currentDay === 3) {
//   day = "Wednesday";
// }
// else if (currentDay === 4) {
//   day = "Thursday";
// }
// else if (currentDay === 5) {
//   day = "Friday";
// }
// else if (currentDay === 6) {
//   day = "Saturday";
// }
// else {
//   day = "Sunday";
//
// }

// using switch
// switch (currentDay) {
//   case 0:
//     day = "Sunday";
//     break;
//     case 1:
//       day = "Monday";
//       break;
//       case 2:
//         day = "Tuesday";
//         break;
//         case 3:
//           day = "Wednesday";
//           break;
//           case 4:
//             day = "Thursday";
//             break;
//             case 5:
//               day = "Friday";
//               break;
//               case 0:
//                 day = "Saturday";
//                 break;
//   default:
//   console.log("Error date")
// }

// we are requiring our 2 packages installed
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const ejs = require('ejs');
let addLists = ["Buy Food","Cook Food", "Eat Food"];
let workItems = [];
// set app view engine to ejs : always plca eit below the declaration
app.set('view engine', 'ejs');
app.use(express.static('public'));

// to retrieve parsed data from browser to server
app.use(bodyParser.urlencoded({extended:true}));
// creating the first get root to send the user Hello when the user access the home root
app.get('/', function(req, res) {

  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  let today  = new Date();

  let day = today.toLocaleDateString("en-US", options);

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

  res.render('index', {listTitle: day, newLists: addLists});
  //res.send('Hello');  // res.send parse data from the server to the browser, allowing us to perform logic on how server
});
app.post('/', function(req, res){
  let item = req.body.newList;
  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect('/work');
  }
  else {
    addLists.push(item);
    res.redirect('/');
  }
});
app.get('/work', function(req,res){
  res.render('index', {listTitle: "Work List", newLists: workItems});
});



// We listen on prot 300 and console log the message
app.listen(port, function(){
  console.log("server is now connected to port: " + port);
});

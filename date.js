module.exports.getDate = getDate;

function getDate(){
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const today  = new Date();
  return today.toLocaleDateString("en-US", options);

}
// we can shorten above code below
exports.getDay = function(){
  const options = { weekday: 'long'};
  const today  = new Date();
  return today.toLocaleDateString("en-US", options);

}

// var gerDay = function(){
//   let options = { weekday: 'long'};
//   let today  = new Date();
//   return today.toLocaleDateString("en-US", options);
//
// }

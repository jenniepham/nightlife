var mongoose = require('mongoose');


// define the schema for our user model
var barSchema = mongoose.Schema({
    

  
    name: String,
    url: String,
    rating: String,
    snippet: String,
    img: String,
    phone: String,
    address: String,
    zipcode: String,
    attendance: Array
    

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Bar', barSchema);

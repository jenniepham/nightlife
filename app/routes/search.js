var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret,
});
var Bar = require('../models/bar.js');


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var url = process.env.MONGO_URL;  
var ObjectId = require('mongodb').ObjectId;
var updateDocuments = require('../models/updateAttendance.js');


module.exports = function(app){
    
  
app.get('/search', function(request, response){
      
     var location = request.query.location;
     yelp.search({ category_filter: 'bars', location: location, limit:10, sort : 2 })
     .then(function (data) {
         
         var searchResult = data;
         console.log(searchResult);
         response.render('search.ejs', {
            user : request.user, data : searchResult.businesses  // get the user out of session and pass to template
        });
         
         searchResult.businesses.forEach(function(a){
             var name = a.name;
             var url = a.url;
             var rating = a.rating_img_url_small;
             var snippet = a.snippet_text;
             var img = a.image_url;
             var phone = a.phone;
             var address = a.location.address;
             var zipcode = a.location['postal_code'];
      
             
            Bar.findOne({'name': name}, function(err, bar){
                
                if (err)
                return (err);
                
                if (!bar) {
                    var newBar = new Bar();
                    newBar.name = name;
                    newBar.url = url;
                    newBar.rating = rating;
                    newBar.snippet = snippet;
                    newBar.img = img;
                    newBar.phone = phone;
                    newBar.address = address;
                    newBar.zipcode = zipcode;
                    newBar.attendance = [];
                    newBar.save(function(err){
                        
                        if (err)
                        throw err;
                        
                    });
                }
            }); 
             
         });
         
     });
      
  });
    
app.get('/bars', isLoggedIn, function(request, response){
    

  var user = request.user._id;
  var userId = new ObjectId(user);
  
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to post server");

    findDocuments(db, function() {
    db.close();
  });
    });
    
   var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Find some documents
  collection.find({_id: userId}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
    
    var userLocation = docs[0]['location'];
    
       
    if (userLocation) {
        
        
        
        yelp.search({ category_filter: 'bars', location: userLocation, limit:10, sort : 2 })
     .then(function (data) {
         
       var searchResult = data;
         response.render('bars.ejs', {
            user : request.user, data : searchResult.businesses, userLocation: userLocation  // get the user out of session and pass to template
        });
        
     });

     }    
     
     else{
    response.render('bars0.ejs', {
            user : request.user// get the user out of session and pass to template
        });
        
        }

  });      
};
   
});


app.get('/bar', function(request, response){
    
   var barName = request.query.name;
   
   if (request.user){
   var user = request.user.local.username;
   }
   
   MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to bars database");

    findDocument(db, function() {
    db.close();
    });
   });
    
   var findDocument = function(db, callback) {

        var collection = db.collection('bars');

        collection.find({'name': barName}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
        
      var  barData = docs[0];
      var attendance = docs[0]['attendance'];
   if (request.user){
      
      if ( attendance.indexOf(user) == -1) {
           
            response.render('showBar.ejs', {
            user : request.user, data: barData, attending: false // get the user out of session and pass to template
        });
       }
       
       else {
           
           response.render('showBar.ejs', {
            user : request.user, data: barData, attending: true // get the user out of session and pass to template
        });
        
       }
   }
   
   else {
       
       response.render('showBar.ejs', {
            user : request.user, data: barData, attending: false // get the user out of session and pass to template
        });
   }
      
        
       
        
        
        });
    };
   

});


app.post('/bar', isLoggedIn, function(request, response){
    
   var barName = request.query.name;
   var user = request.user.local.username;
   var userID = request.user._id;
   var userList = request.user['Attending'];

   
   
   MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to bars database");

    findDocument(db, function() {
    db.close();
    });
   });
    
   var findDocument = function(db, callback) {

        var collection = db.collection('bars');

        collection.find({'name': barName}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records for" + barName);
        console.log(docs);
        callback(docs);
        
        var  attendance = docs[0]['attendance'];
        
       if ( attendance.indexOf(user) == -1) {
            attendance.push(user);
            console.log('New Attendance List:' + attendance);
            updateDocuments(barName,attendance,userID, userList);
            response.redirect('/bar?name=' + barName);
            
       }
       
       else {
           
           var index = attendance.indexOf(user);
           attendance.splice(index,1);
           console.log('New Attendance List:' + attendance);
           updateDocuments(barName,attendance,userID, userList);
           response.redirect('/bar?name=' + barName);
       }
        
       
        
        });
    };
   

});







    
    
};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

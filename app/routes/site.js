var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var url = process.env.MONGO_URL;  
var ObjectId = require('mongodb').ObjectId;
  
module.exports = function(app){
    

app.get('/', function(request, response){
   

  response.render('index.ejs', {
            user : request.user // get the user out of session and pass to template
        });

});


app.get('/home',  isLoggedIn, function(request, response){
 
  
var user = request.user.local.username;
var pollList = [];

var findDocuments = function(db, callback) {
  var collection = db.collection('polls');
  collection.find({"user":user}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
    pollList = docs;
        response.render('home.ejs', {
            user : request.user, data: pollList
        }); 
  });        
};

var url = process.env.MONGO_URL;
  
  
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to get server");

    findDocuments(db, function() {
    db.close();
  
  });
    });
    

   

    
   
});

app.get('/login', isNotLoggedIn, function(request, response){
    response.render('login.ejs', {
            user : request.user, SUmessage: request.flash('signupMessage'), LImessage: request.flash('loginMessage') // get the user out of session and pass to template
        });
   
});

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
app.get('/signup', isNotLoggedIn, function(request, response){
    response.render('signup.ejs', {
            user : request.user, SUmessage: request.flash('signupMessage'), LImessage: request.flash('loginMessage') // get the user out of session and pass to template
        });
   
});


    
app.post('/bars', isLoggedIn, function(request, response){
    
    var location = request.body.locationInput;
    var user = request.user._id;
    var userId = new ObjectId(user);
    
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to post server");

    updateDocuments(db, function() {
    db.close();
  });
    });
    
    
    
    var updateDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  collection.updateOne({_id:userId}, {$set: {location:location}});
  console.log("User location updated");
  
};
});
    

    
};




function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isNotLoggedIn(req,res,next){
    
      if (!req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
    
}
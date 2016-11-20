var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret,
});
var Bar = require('../models/bar.js')


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
             var rating = a.rating;
             var snippet = a.snippet_text;
             var img = a.rating_img_url_small;
             
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
    

    console.log(request.user);
    console.log(request.user._id);
    console.log(request.user.location);
    console.log(request.user.local.username);

    
    
    if (request.user['location']) {
        
        var location = request.user['location'];
        
        yelp.search({ category_filter: 'bars', location: location, limit:10, sort : 2 })
     .then(function (data) {
         
       var searchResult = data;
         console.log(searchResult);
         response.render('bars.ejs', {
            user : request.user, data : searchResult.businesses  // get the user out of session and pass to template
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


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = function(app,passport){
    
app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
    
app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', 
        failureRedirect : '/login',
        failureFlash : true 
    }));
    
    
    
};
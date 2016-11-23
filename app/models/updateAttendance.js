var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var ObjectId = require('mongodb').ObjectId;
  
var url = process.env.MONGO_URL;  


module.exports = function(barName, attendingList, user, userList){
  
    var userBarList = userList;
    
    var index = userBarList.indexOf(barName);
    
    if (index == -1) {
      userBarList.push(barName);
    }
    
    else {
      userBarList.splice(index,1);
    }
    
    var userId = new ObjectId(user);
    
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to post server");

     updateBar(db, function(){
      
          db.close();
      
      });//FindDocuments
    });//mongoclient
    
    
  
    
    var updateBar = function(db, callback) {
  
      var collection = db.collection('bars');
      collection.updateOne({name:barName}, {$set: {attendance:attendingList}});
      console.log("attendance updated");
      console.log("updated attendingList:" + attendingList);
      
      var collection2 = db.collection('users');
      collection2.updateOne({_id:userId}, {$set: {Attending:userBarList}});
      console.log("attendance updated");
      console.log("updated userBarList:" +  userBarList);

  
      };//updatebar

 
    
}; //exports module
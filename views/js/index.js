$(document).ready(function(){
    
    
    
$('#draggButton').on('click', function(){
   
    var input = $("#searchLoc").val();
    window.location.href = '/search?location=' + input;
    
    
});
 

$('#searchLoc').keypress(function(e){
   
   if (e.which == 13){
       var input = $("#searchLoc").val();
    window.location.href = '/search?location=' + input;
   } 
    
});
    
    
    
});
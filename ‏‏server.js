//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DButils');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//local host 
var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
app.post('/register',function (req,res){
    console.log(req.body.City); 
    DButilsAzure.execQuery("Insert Into [registeredUsers]  ([FirstName], [LastName],[City] ,[Country] ,[Email] ,[Categories] ,[Verifiers] ,[Username] , [UserPass])"
    +"VALUES ("+req.body.FirstName+","+req.body.LastName+","+req.body.City+","+req.body.Countr+","+req.body.Email+","+req.body.Categories+","+req.body.Verifiers+","+ req.body.Username+","+req.body.UserPass+")")
    .then(function(result){
        res.send(result);
    })
    .catch(function(err) {
        console.log(err);
    })
});




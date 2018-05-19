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
    //URI values
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName; 
    var City = req.body.City; 
    var Country = req.body.Country;
    var Email = req.body.Email; 
    var Categories = req.body.Categories;
    var Verifiers = req.body.Verifiers;
    var Username = req.body.Username;
    var UserPass=req.body.UserPass;
    //query
    var sql= "INSERT INTO  [registeredUsers]  ([FirstName],[LastName],[City],[Country] ,[Email],[Categories] ,[Verifiers] ,[Username], [UserPass])" 
    + " VALUES('"+FirstName+"','"+LastName+"','"+City+"','" +Country+"','"+Email+"','"+Categories+"','"+Verifiers+"','"+Username+"','"+UserPass+"')"; 
    //execute in azure DB
    DButilsAzure.execQuery(sql)
    .then(function(result){
        res.send(true);
    })
    .catch(function(err) {
        console.log(err);
    })
});




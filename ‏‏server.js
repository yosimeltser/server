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
//register for our page 
//insert new row into the DB
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
        res.send(result);
    })
    .catch(function(err) {
        console.log(err);
    })
});
app.post('/login', function (req,res){
    var Username = req.body.Username;
    var UserPass=req.body.UserPass;
    var sql= "SELECT COUNT(*) FROM registeredUsers  WHERE Username='"+Username+"' AND UserPass= '"+UserPass+"';"
    DButilsAzure.execQuery(sql)    
    .then(function(result){
        var counter=JSON.parse(result[0][""]);
        if (counter==1) {
            res.send('You are logged in now');
        }
        else {
            res.send('Your username or password is incorrect');
        }
    })
    .catch(function(err) {
        console.log(err);
    })
});




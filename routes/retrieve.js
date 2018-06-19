//All the functions of registered users!!!!!
var express = require('express');
var router1 = express.Router();
var DButilsAzure = require('../DButils');

//retrieve all user questions
router1.get("/Questions/:Username", function (req, res) {
    var Username = req.params.Username;
    let last_saved = "SELECT Question FROM Questions Where  FK_Username='" + Username + "'";
    DButilsAzure.execQuery(last_saved)
        .then(function (result) {
            if (result.length==2) {
                res.send(result);
                }
            else {
                res.send(false);
            }
        })
        .catch(function (err) {
            res.send(false);
        })
});

//check if the user answered right
router1.post("/Answers", function(req,res){
    var Username= req.body.Username; 
    var answer1=req.body.answer1;
    var answer2=req.body.answer2;
    let last_saved = "SELECT COUNT(Question) FROM Questions Where  FK_Username='"+Username+"' AND (Answer='"+answer1+ "' OR Answer='"+answer2+"')";
    let sql = "select UserPass from registeredUsers  where Username='" + Username +"'";
    DButilsAzure.execQuery(last_saved)
            .then(function (result) {
                var counter = JSON.parse(result[0][""]);
                if (counter>=1) {
                DButilsAzure.execQuery(sql)
                    .then(function(result1){
                        res.send(result1);
                    })
                }
                else {
                    res.send(false);
                }

            })
            .catch(function (err) {
                console.log(err);
            })
});
module.exports = router1;
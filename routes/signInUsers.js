//All the functions of registered users!!!!!
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');

//The user saves the points to his favorites
router.post('/saveInterestPoint', function (req, res) {
    var Username = req.decoded.payload.Username;
    var PointID = req.body.ID;
    let favorite_q = "INSERT INTO  [Favorites] ([FK_ID],[FK_Username])" +
        " VALUES ('" + PointID + "','" + Username + "' )";
    DButilsAzure.execQuery(favorite_q)
        .then(function (result) {
            //REMEBER TO REMOVE
            res.send("Success");
        })
        .catch(function (err) {
            console.log(err);
        })

});
//TO ASK : to change it to post and then the id will be in the body or to keep DELETE
//method: remove a specific point from the user favorite list
router.delete('/removeInterestPoint/:id', function (req, res) {
    var Username = req.decoded.payload.Username;
    var PointID = req.params.id;
    let remove_favorite_q = "DELETE FROM  [Favorites]" +
        " WHERE FK_ID=" + PointID + " AND FK_Username=" + "'" + Username + "'";
    DButilsAzure.execQuery(remove_favorite_q)
        .then(function (result) {
            //REMEBER TO REMOVE
            res.send("Success");
        })
        .catch(function (err) {
            console.log(err);
        })

});
//returns the favorite list of the user
router.get("/getFavorites", function (req, res) {
    var Username = req.decoded.payload.Username;
    let verifyy_q = "SELECT p.PointName,p.Category FROM  [Points] p INNER JOIN [Favorites] f ON p.ID=f.FK_ID" +
        " WHERE f.FK_Username=" + "'" + Username + "'";
    DButilsAzure.execQuery(verifyy_q)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
});
router.get("/interestPoint/:id", function (req, res) {
    var PointID = req.params.id;
    let random_q = "SELECT  * FROM  [Points] WHERE ID=" + PointID;
    DButilsAzure.execQuery(random_q)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
});

router.post('/Review', function (req, res) {
    var d = new Date(year, month, day);
    var Username = req.decoded.payload.Username;
    var comment = req.body.Review.Comment;
    var PointID = req.body.ID;
    let comment_q = "INSERT INTO  [Comments] ([FK_ID],[FK_Username],[Comment],[Date_Comment])" +
        " VALUES ('" + PointID + "','" + Username + "','" + comment + "','" + d + "' )";
    DButilsAzure.execQuery(comment_q)
        .then(function (result) {
        })
        .catch(function (err) {
            console.log(err);
        })
    if (req.body.Review.Rank !== undefined) {
        var final =computeRating(PointID,req.body.Review.Rank);
        let update = "UPDATE Points SET Ratings =" + final + " WHERE ID=" + PointID;
    }

});
//returns the the last 2 saved point bt the user
router.get("/GetLast2Saved", function (req, res) {
    var Username = req.decoded.payload.Username;
    let last_saved = "SELECT * FROM Points INNER JOIN" +
        "(SELECT TOP 2 FK_ID,  ROW_NUMBER() over (ORDER BY FK_ID DESC) AS Number FROM Favorites WHERE FK_Username=" + "'" + Username + "'" + ")" +
        "AS L ON L.FK_ID=Points.ID ";
    DButilsAzure.execQuery(last_saved)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
});

function computeRating(PointID, rank) {
    var rate,count;
    let q = "SELECT Ratings FROM Points WHERE ID=" + PointID;
    DButilsAzure.execQuery(q)
    .then(function (result) {
        rate=parseInt(result);
    })
    .catch(function (err) {
        console.log(err);
    })
    let c = "SELECT COUNT(FK_ID) FROM Comments WHERE ID=" + PointID;
    DButilsAzure.execQuery(c)
    .then(function (result) {
        count=parseInt(result);
    })
    .catch(function (err) {
        console.log(err);
    })

    let calc = rate * (count - 1);
    calc = calc + parseInt(rank);
    let final = (calc / count * 5) * 100;
    return final;
}
module.exports = router;
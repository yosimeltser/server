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

router.post('/Review', function (req, res) {
    var d = new Date();
    var comment_q;
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    var Username = req.decoded.payload.Username;
    var comment = req.body.Review.Comment;
    var PointID = req.body.ID;
    var Rank = req.body.Review.Rank;
    if (Rank === undefined) {
        comment_q = "INSERT INTO  [Comments] ([FK_ID],[FK_Username],[Comment],[Date_Comment])" +
            " VALUES (" + PointID + ",'" + Username + "','" + comment + "','" + date + "')";
    } else {
        comment_q = "INSERT INTO  [Comments] ([FK_ID],[FK_Username],[Comment],[Date_Comment],[Rank])" +
            " VALUES (" + PointID + ",'" + Username + "','" + comment + "','" + date + "','" + Rank + "' )";
    }
    DButilsAzure.execQuery(comment_q)
        .then(function (result) {
            if (Rank !== undefined) {
                var avg;
                var id = parseInt(PointID);
                var q = "select AVG(Rank) from Comments where FK_ID=" + id;
                DButilsAzure.execQuery(q)
                    .then(function (result) {
                        console.log(result[0][""]);
                        avg = parseFloat(result[0][""]);
                        var calc = avg * 20;
                        let update = "UPDATE Points SET Ratings =" + calc + " WHERE ID=" + PointID;
                        DButilsAzure.execQuery(update)
                            .then(function (res1) {
                                res.send('update rank');
                                //  var final = computeRating(PointID);
                                // console.log(final);
                                // let update = "UPDATE Points SET Ratings =" + final + " WHERE ID=" + PointID;
                                // DButilsAzure.execQuery(update)
                                //     .then(function (res1) {
                                //         res1.send('update rank');
                                //     })
                            })
                            .catch(function (err) {
                                console.log(err);
                            })

                    });
            }
        }).catch(function (err) {
            console.log(err);
        })
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
//returns 2 of the most popular POI by the categories that the user choose in registeration.
router.get('/Get2InterestPoint', function (req, res) {
    var Username = req.decoded.payload.Username;
    let popular = "SELECT TOP 2 * FROM Points INNER JOIN" +
        "(SELECT Category FROM Categories WHERE FK_Username=" + "'" + Username + "'" + ") AS L ON L.Category=Points.Category" +
        "ORDER BY Points.Views DESC ";
    DButilsAzure.execQuery(popular)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
});

function computeRating(PointID) {
    return new Promise(function (fulfill, reject) {
        var avg;
        var id = parseInt(PointID);
        var q = "select AVG(Rank) from Comments where FK_ID=" + id;
        DButilsAzure.execQuery(q)
            .then(function (result) {
                console.log(result[0][""]);
                avg = parseFloat(result[0][""]);
                var calc = avg * 20;
                resolve(calc);
            })
    });
}


module.exports = router;
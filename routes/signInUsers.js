//All the functions of registered users!!!!!
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');

//The user saves the points to his favorites
router.post('/saveInterestPoint', function (req, res) {
    var Username = req.decoded.payload.Username;
    var PointID = req.body.ID;
    let favorite_q = "INSERT INTO  [Favorites] ([FK_ID],[FK_Username],[Added])" +
        " VALUES ('" + PointID + "','" + Username + "',0 )";
    DButilsAzure.execQuery(favorite_q)
        .then(function (result) {
            res.send(true);
        })
        .catch(function (err) {
            res.send(false);
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
            res.send(true);
        })
        .catch(function (err) {
            res.send(false);
        })

});
//returns the favorite list of the user
router.get("/Favorites", function (req, res) {
    var Username = req.decoded.payload.Username;
    let verifyy_q = "SELECT p.ID,p.PointName,p.Category,p.Ratings FROM  [Points] p INNER JOIN [Favorites] f ON p.ID=f.FK_ID" +
        " WHERE f.FK_Username=" + "'" + Username + "'";
    DButilsAzure.execQuery(verifyy_q)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
});

//inserts comment to the DB 
router.post('/Comment', function (req, res) {
    var d = new Date();
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    var Username = req.decoded.payload.Username;
    var comment = req.body.Comment;
    var PointID = req.body.ID;
    comment_q = "INSERT INTO  [Comments] ([FK_ID],[FK_Username],[Comment],[Date_Comment])" +
            " VALUES (" + PointID + ",'" + Username + "','" + comment + "','" + date + "')";
    DButilsAzure.execQuery(comment_q)
        .then(function (result) {
                res.send(true);
        }).catch(function (err) {
            console.log(err);
        })
});
router.post('/Rank', function (req, res) {
    var Username = req.decoded.payload.Username;
    var PointID = req.body.ID;
    var Rank = req.body.Rank;
    comment_q = "INSERT INTO  [Ranks] ([FK_ID],[FK_Username], [Rankung])" +
            " VALUES (" + PointID + ",'" + Username + "','" + Rank + "')";
    DButilsAzure.execQuery(comment_q)
        .then(function (result) {
                var avg;
                var id = parseInt(PointID);
                var q = "select AVG(Rankung) from Ranks where FK_ID=" + id;
                DButilsAzure.execQuery(q)
                    .then(function (result) {
                        avg = parseFloat(result[0][""]);
                        var calc = avg * 20;
                        let update = "UPDATE Points SET Ratings =" + calc + " WHERE ID=" + PointID;
                        DButilsAzure.execQuery(update)
                            .then(function (res1) {
                                res.send(true);
                            })
                            .catch(function (err) {
                                console.log(err);
                            })

                    });
        }).catch(function (err) {
            console.log(err);
        })
});
//returns the the last 2 saved point to the user
router.get("/Last2Saved", function (req, res) {
    var Username = req.decoded.payload.Username;
    let last_saved = "SELECT Points.ID,Points.PointName,Points.Category,Points.Views,Points.Ratings,Points.ref FROM Points INNER JOIN" +
        "(SELECT TOP 2 FK_ID FROM Favorites WHERE FK_Username=" + "'" + Username + "'" + " ORDER BY Saved DESC)" +
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
router.get('/2InterestPoint', function (req, res) {
    var Username = req.decoded.payload.Username;
    let popular = "SELECT TOP 2 * FROM Points INNER JOIN " +
        "(SELECT Category FROM Categories WHERE FK_Username=" + "'" + Username + "'" + ") AS L ON L.Category=Points.Category " +
        "ORDER BY Points.Views DESC ";
    DButilsAzure.execQuery(popular)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
});

router.post('/saveOrderedFavoriteList', function (req, res) {
    var Username = req.decoded.payload.Username;
    var arrId = req.body.Ids;
    for (let i = 0; i < arrId.length; i++) {
        let favoritePoint = "UPDATE Favorites SET Added=" +i+ " where  FK_Username='"+Username + "'"+
        " AND FK_ID=" +arrId[i]; 
        DButilsAzure.execQuery(favoritePoint)
            .then(function (result) {
                if (i == arrId.length - 1) {
                    res.send(true);
                }
            })
            .catch(function (err) {
                res.send(false);
            })
    }
})
module.exports = router;
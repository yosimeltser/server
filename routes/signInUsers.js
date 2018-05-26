//All the functions of registered users!!!!!
var express= require('express'); 
var router = express.Router(); 
router.post('/saveInterestPoint/:ID', function (req,res){
    var u=req.decoded.payload.Username;
    res.send(u);
});
module.exports = router;
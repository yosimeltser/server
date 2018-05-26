var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var jwt = require('jsonwebtoken');
app.use(cors());
var DButilsAzure = require('./DButils');
//only registered users can operate functions on the file regUsers. 
var signInUsers = require('./routes/signInUsers')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//local host 
var port = 4000;


app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
var superSecret = "AKAunbreakable";
app.use(function (req, res, next) {

    console.log("server got request");
    next();

});
//check that the user name & the password meet the criteria
function check_input(user, password) {
    var ans = {
        flag: "",
        message: ""
    };
    if (/^[a-zA-Z]+$/.test(user)) {
        if (user.length >= 2 && user.length <= 8) {
            if (/^[a-z0-9]+$/.test(password)) {
                if (password.length <= 10 && password.length >= 5) {
                    ans.flag = true;
                }
                else {
                    ans.flag = false;
                    ans.message = "Password must be between 5 and 10"
                }
            }
            else {
                ans.flag = false;
                ans.message = "Password must contain only letters and digits"
            }
        }
        else {
            ans.flag = false;
            ans.message = "User name must be between 2 and 8 letters"
        }
    }
    else {
        ans.flag = false;
        ans.message = "User name must contain only letters";
    }
    return ans;
}
//register for our page 
//insert new row into the DB
app.post('/register', function (req, res) {
    //URI values
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var City = req.body.City;
    var Country = req.body.Country;
    var Email = req.body.Email;
    var Categories = req.body.Categories;
    var Questions = req.body.Questions;
    var Verifiers = req.body.Verifiers;
    var Username = req.body.Username;
    var UserPass = req.body.UserPass;
    //query
    let ans = check_input(Username,UserPass);
    if(ans['flag']){
    var sql = "INSERT INTO  [registeredUsers]  ([Username],[FirstName],[LastName],[City],[Country] ,[Email], [UserPass])"
        + " VALUES('" + Username + "','" + FirstName + "','" + LastName + "','" + City + "','" + Country + "','" + Email + "','" + UserPass + "')";
        DButilsAzure.execQuery(sql)
        .then(function (result) {
           // res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
    for(let i=0;i<Categories.length;i++){
        let category_q="INSERT INTO  [Categories] ([Category],[FK_Username])"+
        " VALUES ('" + Categories[i] + "','" + Username + "' )";
        DButilsAzure.execQuery(category_q)
        .then(function (result) {
        })
        .catch(function (err) {
            console.log(err);
        })
    }
    for(let i=0;i<Questions.length;i++){
        for(let j=0;j<Verifiers.length;j++){
        let verifyy_q="INSERT INTO  [Questions] ([Question],[Answer],[FK_Username])"+
        " VALUES ('" + Questions[i] + "','"+Verifiers[j] +"','"+ Username + "' )";
        DButilsAzure.execQuery(verifyy_q)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err);
        })
    }
    }
    }
    else {
        res.send(ans[1]);
    }
});
//when you are loggen in you wre onboard, because we are creating a teken for a session (24H).
app.post('/login', function (req, res) {
    var Username = req.body.Username;
    var UserPass = req.body.UserPass;
    var sql = "SELECT COUNT(*) FROM registeredUsers  WHERE Username='" + Username + "' AND UserPass= '" + UserPass + "';"
    DButilsAzure.execQuery(sql)
        .then(function (result) {
            var counter = JSON.parse(result[0][""]);
            if (counter == 1) {
                //the user is registered, create a token for him. 
                var payload = { Username: Username }
                var token = jwt.sign(payload, superSecret, { expiresIn: "1d" });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
            else {
                res.send('Your username or password is incorrect');
            }
        })
        .catch(function (err) {
            console.log(err);
        })

});
// route middleware to verify a token
app.use('/Users', function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                var decoded = jwt.decode(token, { complete: true });
                req.decoded = decoded;
                console.log(decoded.header);
                console.log(decoded.payload)
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

});
app.use('/Users', signInUsers);

app.get("/getPoints",function(req,res){
    let points_q="SELECT * FROM  [Points]";
    DButilsAzure.execQuery(points_q)
    .then(function (result) {
        res.send(result);
    })
    .catch(function (err) {
        console.log(err);
    })
});

//get 3 random points for not registered/logged in users
//CHECK IF NEWID NOT A HEAVY TASK, CHECK IF THE POINTS THAT RETURNED STANDS WITH CONDITION
app.get("/Get3RendomPoints",function(req,res){
    let random_q="SELECT TOP 3 * FROM  [Points] WHERE Ratings>60 ORDER BY NEWID()";
    DButilsAzure.execQuery(random_q)
    .then(function (result) {
        res.send(result);
    })
    .catch(function (err) {
        console.log(err);
    })
});


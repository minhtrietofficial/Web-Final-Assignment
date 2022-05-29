var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: '../public/uploads/' });
var fs = require('fs');
var path = require('path');
var { body, validationResult } = require('express-validator');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var credentials = require('../credentials');
var session = require('express-session');


const app = express()
app.use(express.json())


/* GET home page. */
router.get('/', function (req, res, next) {
    let context = {
        title: 'Login | BKTPay',
        layout: 'sublayout'
    }
    res.render('login', context);
});

router.post('/',
    exports.login = async (req, res, next) => {
        const { username, password } = req.body
        // Check if username and password is provided
        if (!username || !password) {
          return res.status(400).json({
            message: "Username or Password not present",
          })
        }
        try {
          const user = await User.findOne({ username })
          if (!user) {
            res.status(400).json({
              message: "Login not successful",
              error: "User not found",
            })
          } else {
            // comparing given password with hashed password
            bcrypt.compare(password, user.password).then(function (result) {
              result
                ? res.status(200).json({
                    message: "Login successful",
                    user,
                  })
                : res.status(400).json({ message: "Login not succesful" })
            })
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                    { id: user._id, username, role: user.role },
                    jwtSecret,
                    {
                    expiresIn: maxAge, // 3hrs in sec
                    }
                );
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000, // 3hrs in ms
                });
                res.status(201).json({
                    message: "User successfully Logged in",
                    user: user._id,
                });
                } else {
                res.status(400).json({ message: "Login not succesful" });
                }
            });
            }
        }catch (error) {
            res.status(400).json({
                message: "An error occurred",
                error: error.message,
            })
            }
});

router.get('/login', function (req, res, next) {
    let context = {
        title: 'Login | BKTPay',
        layout: 'sublayout'
    }
    res.render('login', context);
});
router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

module.exports = router;

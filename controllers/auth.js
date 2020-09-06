const User = require("../models/user"); // here we need to import the user model to be able to use it
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signin = (req,res) => {
    
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(422).json({
            errors: `${errors.array()[0].param} has error which says ${errors.array()[0].msg}`
        });
    }

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User not found!"
            });
        }

        // check if password matched
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password mismatch"
            });

        }

        // ~~~~~~~~~~~~Now signin~~~~~~~~~~~~~
        // Create a token
        const token = jwt.sign( { _id: user._id }, process.env.SECRET );
        // put the token into cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        // send response to front end
        const { _id, firstName, email, role } = user;
        return res.json({token, user:{ _id, firstName, email, role}});

    });
};

exports.signup = (req,res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()){
        return res.status(422).json({
            errors: `${errors.array()[0].param} has error which says ${errors.array()[0].msg}`
        });
    }

    const user = new User(req.body);
    // send a response to the user after saving the new user
    // (err, user) : this is common in firebase as well and here 'user' but can be any name
    user.save((err, user)=> {
        if(err){
            return res.status(400).json({
                err: "Not able to save user in DB"
            });
        }
        res.json({
            firstName: user.firstName,
            email: user.email,
            id: user._id
        });
    });
};

exports.signout = (req,res) => {
    res.clearCookie("token");    
    res.json({
        message: "Sign out successful!!"
    });
};

// protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});


// custom middlewares
exports.isAuthenticated = (req, res, next) => {
    //req.profile is set in the front end, possibly the data that includes wrt user such as -id
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req,res, next) => {
    if(!req.profile.role == 0){
        return res.status(403).json({
            error: "You're not an ADMIN, access denied"
        });
    }
    next();
};
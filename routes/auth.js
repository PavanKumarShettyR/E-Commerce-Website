var express = require('express');
var router  = express.Router();
const { check, validationResult } = require('express-validator');

// const {signup} = require("../controllers/auth.js");
const {signout, signup, signin, isSignedIn} = require("../controllers/auth.js");


router.post("/signup", [
    check("firstName", "First Name must be at least 3 chars long!").isLength({ min: 3 }),
    check("email", "Invalid email address!").isEmail(),
    check("password", "Password must be at least 5 chars long!").isLength({min: 5})
], signup);

router.post("/signin", [
    check("email", "Invalid email address!").isEmail(),
    check("password", "Password required!").isLength({min: 5})
], signin);

router.get("/signout", signout);


module.exports = router;
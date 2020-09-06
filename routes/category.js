const express = require('express');
const router = express.Router();


const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, removeCategory} = require("../controllers/category");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// my actual routes

// create category
router.post("/category/create/:userId",
        isSignedIn,
        isAuthenticated,
        isAdmin,
        createCategory);


// read category
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

// update category
router.put("/category/:categoryId/:userId",
        isSignedIn,
        isAuthenticated,
        isAdmin,
        updateCategory);


// delete category
router.delete("/category/:categoryId/:userId",
        isSignedIn,
        isAuthenticated,
        isAdmin,
        removeCategory);

module.exports = router;

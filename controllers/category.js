const Category = require("../models/category");
const { count } = require("../models/category");
const category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Could not find the category in DB"
            });
        }

        req.category = category; //the category is passed for the next middlewares or function to use the data like the req.profile
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);

    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "UNABLE TO SAVE THE CATEGORY!!"
            });

        }
        res.json({category});
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        // if(!categories.count > 0){ return res.send("No categories defined")};
        if(err){
            return res.status(400).json({
                error: "Failed to find the categories from DB"
            });
        }
        res.json(categories);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;  //assigning the one thrown by the getCategoryById
    category.name = req.body.name;  //updating with the value from the request

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update the Category!!"
            });
        }
        res.json(updatedCategory);
    });
    // below are not required as we're already getting the right one getCategoryById which already handles if ID not found 
    // Category.findByIdAndUpdate(req.category.id).exec((err, cate) => {
    //     if(err){
    //         return res.status(400).json({
    //             error: "Failed to update the Category!!"
    //         });
    //     }

    //     res.json(cate);
    // });
};

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: `Failed to delete ${category.name}!!`
            });
        }
        res.json({
            message: `Successfully deleted ${category.name}`
        });
    });
};
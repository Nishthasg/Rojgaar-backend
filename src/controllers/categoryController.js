const Category = require('../models/Category');

const getWorkerCategory = async (req, res) =>{
    try{
        const categories = await Category.find().sort({name: 1});
        return res.status(200).json({
            success: true,
            message: "Worker categories retrieved successfully.",
            data: categories
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error: error.message
        });
    }
}

module.exports = {
    getWorkerCategory
}
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const loginUser = async(req,res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: 'Email and Password are required'
        });
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({
            success: false,
            message: 'Invalid Email or password '
        });
    }
    const isPasswordMathed = await bcrypt.compare(password, user.password);
    if(!isPasswordMathed){
        return res.status(401).json({
            success: false,
            message: 'Invalid Email or password '
        });
    }
    const token = jwt.sign(
     {
         id : user.id,
         role: user.role
     },
     process.env.JWT_SECRET,
     {
        expiresIn: process.env.JWT_EXPIRES_IN
     }
    );
        return res.status(200).json({
             success: true,
             message: 'Login successfully',
             token,
             data: user
        });
}

const getProfile = async(req, res) => {
    try{
        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: req.user
        })
    }
    catch{
        return res.status(500).json({
          success: false,
          message: 'Internal server Error',
          error: error.message
        });
    }
}
module.exports = {
    registerUser,
    loginUser,
    getProfile
};
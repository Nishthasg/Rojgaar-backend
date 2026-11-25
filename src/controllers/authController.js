const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedPhone = String(phone).trim();

        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { phone: normalizedPhone }]
        });

        if (existingUser) {
            const message = existingUser.email === normalizedEmail
                ? "Email already registered"
                : "Phone number already registered";
            return res.status(409).json({
                success: false,
                message
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: normalizedEmail,
            phone: normalizedPhone,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            const message = field === 'phone'
                ? "Phone number already registered"
                : field === 'email'
                    ? "Email already registered"
                    : "User already exists";
            return res.status(409).json({
                success: false,
                message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const identifier = String(email || '').trim();

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required'
            });
        }

        const user = await User.findOne(
            identifier.includes('@')
                ? { email: identifier.toLowerCase() }
                : { $or: [{ email: identifier.toLowerCase() }, { phone: identifier }] }
        ).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Email or password'
            });
        }

        const isPasswordMatched = await bcrypt.compare(String(password), user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Email or password'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            }
        );

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            token,
            data: userData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
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
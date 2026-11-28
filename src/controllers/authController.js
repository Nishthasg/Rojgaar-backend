const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sentMail');

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
//forgot password  code 
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    // Use the same response for existing and non-existing emails
    // to prevent account enumeration.
    const response = {
      success: true,
      message: 'If an account exists with this email, a reset link will be sent.'
    };

    if (!user) {
      return res.status(200).json(response);
    }

    // Generate a cryptographically secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before saving it in MongoDB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;

    // Token expires after 15 minutes
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create frontend reset URL
    const resetURL =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Reset Your Rojgaar Password</h2>

      <p>We received a request to reset your password.</p>

      <p>Click the button below to reset your password:</p>

      <a href="${resetURL}"
         style="background:#0d6efd;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:5px;">
         Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>

      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Rojgaar - Password Reset Request',
        html: message
      });

      return res.status(200).json(response);

    } catch (emailError) {
      // Remove token if email sending fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({ validateBeforeSave: false });

      console.error('Email sending failed:', emailError);

      return res.status(500).json({
        success: false,
        message: 'Unable to send reset email. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    });
  }
};
const resetPassword = async (req, res) => {
  console.log('RESET PASSWORD CONTROLLER HIT');
  console.log('Controller request body:', req.body);
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters'
      });
    }

    // Hash the token received from Angular
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token that has not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired.'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    // Invalidate the reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Track when password changed
    user.passwordChangedAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login.'
    });

  } catch (error) {
    console.error('Reset password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    });
  }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    forgotPassword,
    resetPassword
};
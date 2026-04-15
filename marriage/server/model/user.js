import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import gender from '../enums/gender.js';
import userType from '../enums/userType.js';
import status from '../enums/status.js';
import authProvider from '../enums/authProvider.js';
mongoose.pluralize(null);
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            // match: [
            //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            //     'Please provide a valid email',
            // ],
        },
        password: {
            type: String,
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: [gender.FEMALE, gender.MALE, gender.OTHER],
        },

        // Firebase / Google Sign-In fields
        googleId: {
            type: String,
            sparse: true,
        },
        authProvider: {
            type: String,
            enum: [authProvider.LOCAL, authProvider.GOOGLE, authProvider.FIREBASE],
            default: authProvider.LOCAL,
        },

        // Device token for push notifications (FCM)
        deviceToken: {
            type: String,
            default: '',
        },

        status: {
            type: String,
            enum: [status.ACTIVE, status.INACTIVE, status.BLOCKED, status.PENDING],
            default: status.PENDING,
        },

        userType: {
            type: String,
            enum: [userType.USER, userType.ADMIN, userType.SUB_ADMIN, userType.PREMIUM],
            default: userType.USER,
        },

        isPremium: {
            type: Boolean,
            default: false,
        },
        premiumExpiresAt: {
            type: Date,
            default: null,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        otp: {
            type: String,
        },
        otpExpireTime: {
            type: Date,
        },

        // References to other models
        templates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template',
        }],
        purchases: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        }],
    },
    {
        timestamps: true,
    }
);

// Index for email and googleId for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });




const User = mongoose.model('User', userSchema);
export default User;
import * as authService from '../services/authService.js';
import { userType, status, authProvider } from '../../../enums/index.js';
import { hashPassword,comparePassword } from '../../../helper/commonFunction.js';
export const signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.validatedData;

        // Check if confirmPassword matches password (if provided)
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match',
            });
        }

        // Check if user already exists
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }
        const hashedPassword = await hashPassword(password);
        const payload = {
            name,
            email,
            password: hashedPassword,
            userType: userType.USER,
            status: status.ACTIVE,
            authProvider: authProvider.LOCAL,
        }
        // Create new user
        const user = await authService.createUser(payload);

        const token = authService.generateAuthToken(user._id, user.userType);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            },
            token,
        });
    } catch (error) {
        return next(error);
    }
};

export const login = async (req, res,next) => {
    try {
        const { email, password } = req.validatedData;

        // Find user and explicitly select password field
        const user = await authService.findUserByEmailWithPassword(email);

        if (!user || !(await comparePassword(user, password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Update last logged in
        await authService.updateLastLoggedIn(user._id);

        const token = authService.generateAuthToken(user._id, user.userType);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                isPremium: user.isPremium,
            },
            token,
        });
    } catch (error) {
        return next(error);
    }
};

export const getMe = async (req, res,next) => {
    try {
        const user = await authService.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return next(error);
    }
};

export const refreshToken = async (req, res,next) => {
    try {
        const user = await authService.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const newToken = authService.generateAuthToken(user._id, user.userType);

        res.status(200).json({
            success: true,
            message: 'Token refreshed',
            token: newToken,
        });
    } catch (error) {
        return next(error);
    }
};

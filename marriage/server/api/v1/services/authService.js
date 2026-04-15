import User from '../../../model/user.js';
import { generateToken } from '../../../middleware/auth.js';

/**
 * User Service - Handles all user-related database operations
 */

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise} User object or null
 */
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise} User object or null
 */
export const findUserById = async (id) => {
    return await User.findById(id);
};

/**
 * Find user by email with password field
 * @param {string} email - User email
 * @returns {Promise} User object with password or null
 */
export const findUserByEmailWithPassword = async (email) => {
    return await User.findOne({ email }).select('+password');
};

/**
 * Find user by Google ID
 * @param {string} googleId - Google ID
 * @returns {Promise} User object or null
 */
export const findUserByGoogleId = async (googleId) => {
    return await User.findOne({ googleId });
};

/**
 * Create new user
 * @param {object} userData - User data
 * @returns {Promise} Created user object
 */
export const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

/**
 * Update user by ID
 * @param {string} id - User ID
 * @param {object} updateData - Data to update
 * @returns {Promise} Updated user object
 */
export const updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
};

/**
 * Update user templates array
 * @param {string} userId - User ID
 * @param {string} templateId - Template ID
 * @param {string} operation - 'push' or 'pull'
 * @returns {Promise} Updated user object
 */
export const updateUserTemplates = async (userId, templateId, operation = 'push') => {
    const updateQuery = operation === 'push'
        ? { $push: { templates: templateId } }
        : { $pull: { templates: templateId } };
    
    return await User.findByIdAndUpdate(userId, updateQuery, { new: true });
};

/**
 * Update user purchases array
 * @param {string} userId - User ID
 * @param {string} transactionId - Transaction ID
 * @param {string} operation - 'push' or 'pull'
 * @returns {Promise} Updated user object
 */
export const updateUserPurchases = async (userId, transactionId, operation = 'push') => {
    const updateQuery = operation === 'push'
        ? { $push: { purchases: transactionId } }
        : { $pull: { purchases: transactionId } };
    
    return await User.findByIdAndUpdate(userId, updateQuery, { new: true });
};

/**
 * Verify password for user
 * @param {object} user - User object with matchPassword method
 * @param {string} password - Password to verify
 * @returns {Promise<boolean>} True if password matches
 */
export const verifyPassword = async (user, password) => {
    return await user.matchPassword(password);
};

/**
 * Generate auth token for user
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateAuthToken = (userId, role = 'user') => {
    return generateToken(userId, role);
};

/**
 * Get all users (admin only)
 * @param {object} options - Query options (page, limit, search)
 * @returns {Promise} Users list with pagination
 */
export const getAllUsers = async (options = {}) => {
    const { page = 1, limit = 10, search = '' } = options;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };
    }

    const users = await User.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
        users,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Delete user by ID
 * @param {string} id - User ID
 * @returns {Promise} Deleted user object
 */
export const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};

/**
 * Update user premium status
 * @param {string} userId - User ID
 * @param {boolean} isPremium - Premium status
 * @param {Date} expiresAt - Expiry date
 * @returns {Promise} Updated user object
 */
export const updatePremiumStatus = async (userId, isPremium, expiresAt = null) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                isPremium,
                premiumExpiresAt: expiresAt,
            },
        },
        { new: true }
    );
};

/**
 * Update user last logged in time
 * @param {string} userId - User ID
 * @returns {Promise} Updated user object
 */
export const updateLastLoggedIn = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $set: { lastLoggedIn: new Date() } },
        { new: true }
    );
};

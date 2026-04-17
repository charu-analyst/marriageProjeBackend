import Template from '../../../model/template.js';
import User from '../../../model/user.js';

/**
 * Template Service - Handles all template-related database operations
 */

/**
 * Get all templates with filtering, search, and pagination
 * @param {object} options - Query options
 * @returns {Promise} Templates list with pagination
 */
export const getAllTemplates = async (options = {}) => {
    const { category, search, page = 1, limit = 10, sort = '-createdAt' } = options;

    let query = { isActive: true };

    if (category) {
        query.category = category;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (page - 1) * limit;
    const templates = await Template.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email');

    const total = await Template.countDocuments(query);

    return {
        templates,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
        },
    };
};

export const getTemplates=async(query)=>{
    const { category, search, page = 1, limit = 10, sort = '-createdAt' } = query;
    
    let filter = { isActive: true };
    
}
/**
 * Get template by ID
 * @param {string} id - Template ID
 * @returns {Promise} Template object with creator and ratings
 */
export const getTemplateById = async (id) => {
    return await Template.findById(id)
        .populate('createdBy', 'name email')
        .populate('ratings.userId', 'name');
};

/**
 * Increment template views count
 * @param {string} id - Template ID
 * @returns {Promise} Updated template object
 */
export const incrementTemplateViews = async (id) => {
    return await Template.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
    );
};

/**
 * Increment template downloads count
 * @param {string} id - Template ID
 * @returns {Promise} Updated template object
 */
export const incrementTemplateDownloads = async (id) => {
    return await Template.findByIdAndUpdate(
        id,
        { $inc: { downloads: 1 } },
        { new: true }
    );
};

/**
 * Create new template
 * @param {object} templateData - Template data
 * @returns {Promise} Created template object
 */
export const createTemplate = async (templateData) => {
    const template = new Template(templateData);
    await template.save();
    return template;
};

/**
 * Update template by ID
 * @param {string} id - Template ID
 * @param {object} updateData - Data to update
 * @returns {Promise} Updated template object
 */
export const updateTemplateById = async (id, updateData) => {
    return await Template.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

/**
 * Delete template by ID
 * @param {string} id - Template ID
 * @returns {Promise} Deleted template object
 */
export const deleteTemplateById = async (id) => {
    return await Template.findByIdAndDelete(id);
};

/**
 * Get user's templates
 * @param {string} userId - User ID
 * @returns {Promise} Array of templates
 */
export const getUserTemplates = async (userId) => {
    return await Template.find({ createdBy: userId }).sort('-createdAt');
};

/**
 * Add rating to template
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID
 * @param {number} score - Rating score (1-5)
 * @param {string} review - Review text
 * @returns {Promise} Updated template object
 */
export const addTemplateRating = async (templateId, userId, score, review) => {
    let template = await Template.findById(templateId);

    if (!template) {
        return null;
    }

    // Check if user already rated
    const existingRatingIndex = template.ratings.findIndex(
        r => r.userId.toString() === userId
    );

    if (existingRatingIndex !== -1) {
        // Update existing rating
        template.ratings[existingRatingIndex] = {
            userId,
            score,
            review,
            createdAt: new Date(),
        };
    } else {
        // Add new rating
        template.ratings.push({
            userId,
            score,
            review,
        });
    }

    // Calculate average rating
    const totalScore = template.ratings.reduce((sum, r) => sum + r.score, 0);
    template.rating = (totalScore / template.ratings.length).toFixed(2);

    await template.save();
    return template;
};

/**
 * Remove rating from template
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID
 * @returns {Promise} Updated template object
 */
export const removeTemplateRating = async (templateId, userId) => {
    let template = await Template.findById(templateId);

    if (!template) {
        return null;
    }

    template.ratings = template.ratings.filter(
        r => r.userId.toString() !== userId
    );

    // Recalculate average rating
    if (template.ratings.length > 0) {
        const totalScore = template.ratings.reduce((sum, r) => sum + r.score, 0);
        template.rating = (totalScore / template.ratings.length).toFixed(2);
    } else {
        template.rating = 0;
    }

    await template.save();
    return template;
};

/**
 * Get featured templates
 * @param {number} limit - Number of templates to fetch
 * @returns {Promise} Array of featured templates
 */
export const getFeaturedTemplates = async (limit = 6) => {
    return await Template.find({ isFeatured: true, isActive: true })
        .sort('-createdAt')
        .limit(limit)
        .populate('createdBy', 'name email');
};

/**
 * Get templates by rating
 * @param {number} limit - Number of templates to fetch
 * @returns {Promise} Array of templates sorted by rating
 */
export const getTopRatedTemplates = async (limit = 6) => {
    return await Template.find({ isActive: true })
        .sort('-rating')
        .limit(limit)
        .populate('createdBy', 'name email');
};

/**
 * Get templates by category
 * @param {string} category - Template category
 * @param {number} limit - Number of templates to fetch
 * @returns {Promise} Array of templates in category
 */
export const getTemplatesByCategory = async (category, limit = 10) => {
    return await Template.find({ category, isActive: true })
        .sort('-downloads')
        .limit(limit)
        .populate('createdBy', 'name email');
};

/**
 * Search templates
 * @param {string} searchTerm - Search term
 * @param {number} limit - Number of results
 * @returns {Promise} Array of matching templates
 */
export const searchTemplates = async (searchTerm, limit = 20) => {
    return await Template.find(
        { $text: { $search: searchTerm }, isActive: true },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .populate('createdBy', 'name email');
};

/**
 * Get template by ID without populate (faster)
 * @param {string} id - Template ID
 * @returns {Promise} Template object
 */
export const getTemplateByIdLean = async (id) => {
    return await Template.findById(id).lean();
};

/**
 * Check if user is template creator
 * @param {string} templateId - Template ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if user is creator
 */
export const isTemplateCreator = async (templateId, userId) => {
    const template = await Template.findById(templateId).select('createdBy');
    return template && template.createdBy.toString() === userId;
};

/**
 * Get templates with pagination for admin
 * @param {object} options - Query options
 * @returns {Promise} Templates list with pagination
 */
export const getAllTemplatesAdmin = async (options = {}) => {
    const { page = 1, limit = 10, search = '', category = '' } = options;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    if (category) {
        query.category = category;
    }

    const templates = await Template.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name email');

    const total = await Template.countDocuments(query);

    return {
        templates,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Toggle featured status
 * @param {string} templateId - Template ID
 * @returns {Promise} Updated template object
 */
export const toggleFeaturedStatus = async (templateId) => {
    const template = await Template.findById(templateId);
    if (!template) return null;

    template.isFeatured = !template.isFeatured;
    await template.save();
    return template;
};

/**
 * Bulk update templates status
 * @param {array} templateIds - Template IDs
 * @param {boolean} isActive - Active status
 * @returns {Promise} Update result
 */
export const bulkUpdateTemplateStatus = async (templateIds, isActive) => {
    return await Template.updateMany(
        { _id: { $in: templateIds } },
        { $set: { isActive } }
    );
};

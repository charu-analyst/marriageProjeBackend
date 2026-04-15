import * as templateService from '../services/templateService.js';
import * as authService from '../services/authService.js';

// Get all templates with filtering, search, and pagination
export const getTemplates = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const result = await templateService.getAllTemplates({
      category,
      search,
      page,
      limit,
      sort,
    });

    res.status(200).json({
      success: true,
      data: result.templates,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message,
    });
  }
};

// Get single template
export const getTemplate = async (req, res) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    // Increment views
    await templateService.incrementTemplateViews(req.params.id);

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message,
    });
  }
};

// Create template
export const createTemplate = async (req, res) => {
  try {
    const { title, description, category, content, isPaid, price, tags } = req.validatedData;

    const template = await templateService.createTemplate({
      title,
      description,
      category,
      content,
      isPaid,
      price,
      tags,
      createdBy: req.user.id,
    });

    // Add template to user's templates list
    await authService.updateUserTemplates(req.user.id, template._id, 'push');

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message,
    });
  }
};

// Update template (only creator can update)
export const updateTemplate = async (req, res) => {
  try {
    const template = await templateService.getTemplateByIdLean(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    // Check if user is the creator
    if (template.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this template',
      });
    }

    const updatedTemplate = await templateService.updateTemplateById(
      req.params.id,
      req.validatedData
    );

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: updatedTemplate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message,
    });
  }
};

// Delete template (only creator can delete)
export const deleteTemplate = async (req, res) => {
  try {
    const template = await templateService.getTemplateByIdLean(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    // Check if user is the creator
    if (template.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this template',
      });
    }

    await templateService.deleteTemplateById(req.params.id);

    // Remove template from user's templates list
    await authService.updateUserTemplates(req.user.id, req.params.id, 'pull');

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message,
    });
  }
};

// Get user's templates
export const getUserTemplates = async (req, res) => {
  try {
    const templates = await templateService.getUserTemplates(req.user.id);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user templates',
      error: error.message,
    });
  }
};

// Add rating/review to template
export const rateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { score, review } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const template = await templateService.addTemplateRating(
      templateId,
      req.user.id,
      score,
      review
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message,
    });
  }
};

// Get featured templates
export const getFeaturedTemplates = async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const templates = await templateService.getFeaturedTemplates(limit);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured templates',
      error: error.message,
    });
  }
};

// Get top rated templates
export const getTopRatedTemplates = async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const templates = await templateService.getTopRatedTemplates(limit);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top rated templates',
      error: error.message,
    });
  }
};

// Get templates by category
export const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = req.query.limit || 10;

    const templates = await templateService.getTemplatesByCategory(category, limit);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching templates by category',
      error: error.message,
    });
  }
};

// Search templates
export const searchTemplates = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const limit = req.query.limit || 20;
    const templates = await templateService.searchTemplates(q, limit);

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching templates',
      error: error.message,
    });
  }
};

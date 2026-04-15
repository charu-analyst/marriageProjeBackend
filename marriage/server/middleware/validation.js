import Joi from 'joi';
import templateCategory from '../enums/templateCategory.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }

    req.validatedData = value;
    next();
  };
};

// Validation schemas
export const authSchemas = {
  signup: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const templateSchemas = {
  create: Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().allow(''),
    category: Joi.string()
      .valid(
        templateCategory.BIODATA,
        templateCategory.RESUME,
        templateCategory.COVER_LETTER,
        templateCategory.WEDDING_CARD,
        templateCategory.INVITATION
      )
      .required(),
    content: Joi.object().required(),
    isPaid: Joi.boolean(),
    price: Joi.number().min(0),
    tags: Joi.array().items(Joi.string()),
  }),

  update: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().allow(''),
    category: Joi.string().valid(
      templateCategory.BIODATA,
      templateCategory.RESUME,
      templateCategory.COVER_LETTER,
      templateCategory.WEDDING_CARD,
      templateCategory.INVITATION
    ),
    content: Joi.object(),
    isPaid: Joi.boolean(),
    price: Joi.number().min(0),
    tags: Joi.array().items(Joi.string()),
  }),
};

export const purchaseSchemas = {
  buyTemplate: Joi.object({
    couponCode: Joi.string().trim().optional(),
    paymentMethod: Joi.string()
      .valid('CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'WALLET')
      .required(),
  }),

  refundTemplate: Joi.object({
    reason: Joi.string().required().trim().min(10).max(500),
  }),
};

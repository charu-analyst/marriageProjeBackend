import express from 'express';
import * as templateController from '../controller/templateController.js';
import { protect } from '../../../middleware/auth.js';
import { validateRequest, templateSchemas } from '../../../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/templates:
 *   get:
 *     summary: Get all templates with filtering and search
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 */
router.get('/', templateController.getTemplates);

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   get:
 *     summary: Get single template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 */
router.get('/:id', templateController.getTemplate);

/**
 * @swagger
 * /api/v1/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category, content]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [biodata, resume, cover-letter, wedding-card, invitation]
 *               content:
 *                 type: object
 *               isPaid:
 *                 type: boolean
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.post('/', protect, validateRequest(templateSchemas.create), templateController.createTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   put:
 *     summary: Update a template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: object
 *               isPaid:
 *                 type: boolean
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *     responses:
 *       200:
 *         description: Template updated successfully
 */
router.put('/:id', protect, validateRequest(templateSchemas.update), templateController.updateTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   delete:
 *     summary: Delete a template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template deleted successfully
 */
router.delete('/:id', protect, templateController.deleteTemplate);

/**
 * @swagger
 * /api/v1/templates/user/my-templates:
 *   get:
 *     summary: Get current user's templates
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User templates retrieved successfully
 */
router.get('/user/my-templates', protect, templateController.getUserTemplates);

/**
 * @swagger
 * /api/v1/templates/featured/list:
 *   get:
 *     summary: Get featured templates
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 6
 *     responses:
 *       200:
 *         description: Featured templates retrieved
 */
router.get('/featured/list', templateController.getFeaturedTemplates);

/**
 * @swagger
 * /api/v1/templates/top-rated/list:
 *   get:
 *     summary: Get top rated templates
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 6
 *     responses:
 *       200:
 *         description: Top rated templates retrieved
 */
router.get('/top-rated/list', templateController.getTopRatedTemplates);

/**
 * @swagger
 * /api/v1/templates/category/{category}:
 *   get:
 *     summary: Get templates by category
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Templates by category retrieved
 */
router.get('/category/:category', templateController.getTemplatesByCategory);

/**
 * @swagger
 * /api/v1/templates/search:
 *   get:
 *     summary: Search templates
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *     responses:
 *       200:
 *         description: Templates search results
 */
router.get('/search', templateController.searchTemplates);

/**
 * @swagger
 * /api/v1/templates/{templateId}/rate:
 *   post:
 *     summary: Rate and review a template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating added successfully
 */
router.post('/:templateId/rate', protect, templateController.rateTemplate);

export default router;

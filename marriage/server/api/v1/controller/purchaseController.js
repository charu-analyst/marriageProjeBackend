import {
  createTransaction,
  getTransaction,
  getUserTransactions,
  updateTransactionStatus,
  processRefund,
} from '../services/transactionService.js';
import {
  getTemplate,
  incrementTemplateDownloads,
} from '../services/templateService.js';
import {
  updateUserPurchases,
  getUserById,
} from '../services/authService.js';

/**
 * Purchase a template
 * @param {Object} req - Express request object
 * @param {string} req.params.templateId - Template ID to purchase
 * @param {Object} req.body - Request body
 * @param {string} req.body.couponCode - Optional coupon code
 * @param {string} req.body.paymentMethod - Payment method
 * @returns {Promise<void>}
 */
export const purchaseTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { couponCode, paymentMethod } = req.body;
    const userId = req.user._id;

    // Check if template exists
    const template = await getTemplate(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    // Check if user already purchased
    const user = await getUserById(userId);
    const alreadyPurchased = user.purchases?.some(
      (p) => p.templateId?.toString() === templateId
    );
    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: 'Template already purchased',
      });
    }

    // Calculate amount (apply coupon if provided)
    let amount = template.price || 0;
    let discountAmount = 0;
    if (couponCode) {
      // TODO: Apply coupon logic
      // const coupon = await getCoupon(couponCode);
      // discountAmount = coupon.discount;
      // amount -= discountAmount;
    }

    // Create transaction record
    const transaction = await createTransaction({
      userId,
      templateId,
      amount,
      paymentMethod,
      couponCode: couponCode || null,
      status: 'PENDING',
    });

    // TODO: Process payment with gateway
    // For now, mark as SUCCESS
    const updatedTransaction = await updateTransactionStatus(
      transaction._id,
      'SUCCESS'
    );

    // Add to user purchases
    await updateUserPurchases(userId, updatedTransaction._id, 'add');

    // Increment template downloads
    await incrementTemplateDownloads(templateId);

    res.status(201).json({
      success: true,
      message: 'Template purchased successfully',
      data: {
        transaction: updatedTransaction,
        template: {
          id: template._id,
          name: template.name,
          category: template.category,
        },
      },
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing purchase',
      error: error.message,
    });
  }
};

/**
 * Get user's purchase history
 * @param {Object} req - Express request object
 * @param {number} req.query.page - Page number
 * @param {number} req.query.limit - Results per page
 * @param {string} req.query.status - Filter by status
 * @returns {Promise<void>}
 */
export const getPurchaseHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    // Get user transactions
    const transactions = await getUserTransactions(
      userId,
      parseInt(page),
      parseInt(limit),
      status
    );

    res.status(200).json({
      success: true,
      message: 'Purchase history retrieved successfully',
      data: {
        purchases: transactions.data,
        total: transactions.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(transactions.total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving purchase history',
      error: error.message,
    });
  }
};

/**
 * Get user's downloaded templates
 * @param {Object} req - Express request object
 * @param {number} req.query.page - Page number
 * @param {number} req.query.limit - Results per page
 * @returns {Promise<void>}
 */
export const getUserPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    // Get user's successful purchases
    const transactions = await getUserTransactions(
      userId,
      parseInt(page),
      parseInt(limit),
      'SUCCESS'
    );

    // Map to template data
    const downloads = transactions.data.map((t) => ({
      transactionId: t._id,
      template: t.templateId,
      purchasedAt: t.createdAt,
      downloadCount: t.downloadCount || 0,
    }));

    res.status(200).json({
      success: true,
      message: 'Downloaded templates retrieved successfully',
      data: {
        downloads,
        total: transactions.total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get downloads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving downloads',
      error: error.message,
    });
  }
};

/**
 * Get purchase details
 * @param {Object} req - Express request object
 * @param {string} req.params.transactionId - Transaction ID
 * @returns {Promise<void>}
 */
export const getPurchaseDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    // Get transaction
    const transaction = await getTransaction(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    // Verify user owns this transaction
    if (transaction.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this purchase',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Purchase details retrieved successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Get purchase details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving purchase details',
      error: error.message,
    });
  }
};

/**
 * Download purchased template
 * @param {Object} req - Express request object
 * @param {string} req.params.transactionId - Transaction ID
 * @returns {Promise<void>}
 */
export const downloadTemplate = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    // Get transaction
    const transaction = await getTransaction(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    // Verify user owns this transaction
    if (transaction.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to download this template',
      });
    }

    // Check if transaction is successful
    if (transaction.status !== 'SUCCESS') {
      return res.status(400).json({
        success: false,
        message: 'Cannot download template - purchase not completed',
      });
    }

    // TODO: Generate secure download link
    // 1. Get template file
    // 2. Create download token
    // 3. Log download event
    // 4. Increment download count

    res.status(200).json({
      success: true,
      message: 'Download link generated successfully',
      data: {
        downloadUrl: `http://localhost:8046/api/v1/purchases/${transactionId}/file`,
        expiresIn: 3600, // 1 hour
        template: {
          id: transaction.templateId._id,
          name: transaction.templateId.name,
        },
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing download',
      error: error.message,
    });
  }
};

/**
 * Request refund for purchased template
 * @param {Object} req - Express request object
 * @param {string} req.params.transactionId - Transaction ID
 * @param {string} req.body.reason - Refund reason
 * @returns {Promise<void>}
 */
export const requestRefund = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    // Get transaction
    const transaction = await getTransaction(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    // Verify user owns this transaction
    if (transaction.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to refund this purchase',
      });
    }

    // Check refund eligibility (within 7 days)
    const purchaseDate = new Date(transaction.createdAt);
    const daysDiff = Math.floor(
      (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > 7) {
      return res.status(400).json({
        success: false,
        message: 'Refund window expired (7 days)',
      });
    }

    // Process refund
    const refundedTransaction = await processRefund(transactionId, reason);

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        transaction: refundedTransaction,
        refundAmount: refundedTransaction.refundAmount,
        refundStatus: refundedTransaction.refundStatus,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message,
    });
  }
};

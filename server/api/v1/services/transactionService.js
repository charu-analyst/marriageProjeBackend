import Transaction from '../../model/transactions.js';
import User from '../../model/user.js';
import Template from '../../model/template.js';

/**
 * Create a new transaction record
 * @param {Object} transactionData - Transaction data
 * @param {string} transactionData.userId - User ID
 * @param {string} transactionData.templateId - Template ID
 * @param {number} transactionData.amount - Transaction amount
 * @param {string} transactionData.paymentMethod - Payment method
 * @param {string} transactionData.status - Transaction status
 * @param {string} transactionData.couponCode - Optional coupon code
 * @param {string} transactionData.subscriptionId - Optional subscription ID
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const transaction = await Transaction.create({
      userId: transactionData.userId,
      templateId: transactionData.templateId,
      subscriptionId: transactionData.subscriptionId || null,
      amount: transactionData.amount,
      status: transactionData.status || 'PENDING',
      paymentMethod: transactionData.paymentMethod,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      couponCode: transactionData.couponCode || null,
      refundAmount: 0,
      gatewayResponse: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await transaction.populate(['userId', 'templateId']);
  } catch (error) {
    throw new Error(`Error creating transaction: ${error.message}`);
  }
};

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object|null>} Transaction data or null
 */
export const getTransaction = async (transactionId) => {
  try {
    return await Transaction.findById(transactionId).populate([
      'userId',
      'templateId',
    ]);
  } catch (error) {
    throw new Error(`Error fetching transaction: ${error.message}`);
  }
};

/**
 * Get transaction by custom transaction ID
 * @param {string} customTransactionId - Custom transaction ID (TXN-xxx)
 * @returns {Promise<Object|null>} Transaction data or null
 */
export const getTransactionByCustomId = async (customTransactionId) => {
  try {
    return await Transaction.findOne({
      transactionId: customTransactionId,
    }).populate(['userId', 'templateId']);
  } catch (error) {
    throw new Error(`Error fetching transaction: ${error.message}`);
  }
};

/**
 * Get user's transactions with pagination
 * @param {string} userId - User ID
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Results per page
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Object>} Transactions and metadata
 */
export const getUserTransactions = async (userId, page = 1, limit = 10, status = null) => {
  try {
    const skip = (page - 1) * limit;
    const query = { userId };

    if (status) {
      query.status = status;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .skip(skip)
        .limit(limit)
        .populate(['userId', 'templateId'])
        .sort({ createdAt: -1 }),
      Transaction.countDocuments(query),
    ]);

    return {
      data: transactions,
      total,
      page,
      limit,
    };
  } catch (error) {
    throw new Error(`Error fetching user transactions: ${error.message}`);
  }
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} newStatus - New status (PENDING, SUCCESS, FAILED, REFUNDED)
 * @param {Object} gatewayResponse - Optional gateway response
 * @returns {Promise<Object>} Updated transaction
 */
export const updateTransactionStatus = async (transactionId, newStatus, gatewayResponse = null) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: newStatus,
        gatewayResponse: gatewayResponse || null,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate(['userId', 'templateId']);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  } catch (error) {
    throw new Error(`Error updating transaction: ${error.message}`);
  }
};

/**
 * Process refund for a transaction
 * @param {string} transactionId - Transaction ID
 * @param {string} reason - Refund reason
 * @returns {Promise<Object>} Updated transaction
 */
export const processRefund = async (transactionId, reason = '') => {
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'SUCCESS') {
      throw new Error('Can only refund successful transactions');
    }

    // Calculate refund amount (full refund for now)
    const refundAmount = transaction.amount;

    // Update transaction
    const refundedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: 'REFUNDED',
        refundAmount,
        refundReason: reason,
        refundStatus: 'COMPLETED',
        refundedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).populate(['userId', 'templateId']);

    // Remove from user purchases
    const userId = transaction.userId;
    await User.findByIdAndUpdate(userId, {
      $pull: { purchases: transactionId },
    });

    // TODO: Process actual refund with payment gateway
    // TODO: Update wallet with refund amount

    return refundedTransaction;
  } catch (error) {
    throw new Error(`Error processing refund: ${error.message}`);
  }
};

/**
 * Get transaction statistics for a template
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} Transaction statistics
 */
export const getTemplateTransactionStats = async (templateId) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { templateId: templateId, status: 'SUCCESS' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          averageSale: { $avg: '$amount' },
        },
      },
    ]);

    return stats[0] || {
      totalSales: 0,
      totalTransactions: 0,
      averageSale: 0,
    };
  } catch (error) {
    throw new Error(`Error fetching transaction stats: ${error.message}`);
  }
};

/**
 * Get user's total spending
 * @param {string} userId - User ID
 * @returns {Promise<number>} Total spending amount
 */
export const getUserTotalSpending = async (userId) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { userId: userId, status: 'SUCCESS' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    throw new Error(`Error calculating user spending: ${error.message}`);
  }
};

/**
 * Get revenue report for date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Daily revenue data
 */
export const getRevenueReport = async (startDate, endDate) => {
  try {
    return await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'SUCCESS',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  } catch (error) {
    throw new Error(`Error generating revenue report: ${error.message}`);
  }
};

/**
 * Delete transaction (admin only)
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Deleted transaction
 */
export const deleteTransaction = async (transactionId) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    throw new Error(`Error deleting transaction: ${error.message}`);
  }
};

/**
 * Get top selling templates
 * @param {number} limit - Number of templates to return
 * @returns {Promise<Array>} Top selling templates
 */
export const getTopSellingTemplates = async (limit = 10) => {
  try {
    const topSelling = await Transaction.aggregate([
      { $match: { status: 'SUCCESS' } },
      {
        $group: {
          _id: '$templateId',
          sales: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'templates',
          localField: '_id',
          foreignField: '_id',
          as: 'template',
        },
      },
    ]);

    return topSelling;
  } catch (error) {
    throw new Error(`Error fetching top selling templates: ${error.message}`);
  }
};

/**
 * Check if user has purchased a template
 * @param {string} userId - User ID
 * @param {string} templateId - Template ID
 * @returns {Promise<boolean>} True if user purchased template
 */
export const hasUserPurchasedTemplate = async (userId, templateId) => {
  try {
    const transaction = await Transaction.findOne({
      userId,
      templateId,
      status: 'SUCCESS',
    });

    return !!transaction;
  } catch (error) {
    throw new Error(`Error checking purchase: ${error.message}`);
  }
};

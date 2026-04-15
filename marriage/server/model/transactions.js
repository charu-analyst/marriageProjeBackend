import mongoose from 'mongoose';
import paymentStatus from '../enums/paymentStatus.js';
import paymentMethod from '../enums/paymentMethod.js';
mongoose.pluralize(null);
const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template',
        },
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription',
        },
        amount: {
            type: Number,
            min: 0,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        status: {
            type: String,
            enum: [
                paymentStatus.PENDING,
                paymentStatus.SUCCESS,
                paymentStatus.FAILED,
                paymentStatus.CANCELLED,
                paymentStatus.REFUNDED,
            ],
            default: paymentStatus.PENDING,
        },
        paymentMethod: {
            type: String,
            enum: [
                paymentMethod.STRIPE,
                paymentMethod.RAZORPAY,
                paymentMethod.PAYPAL,
                paymentMethod.BANK_TRANSFER,
                paymentMethod.UPI,
            ],
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        orderId: {
            type: String,
            unique: true,
            sparse: true,
        },
        paymentGatewayResponse: {
            type: mongoose.Schema.Types.Mixed,
        },
        description: {
            type: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
        refundAmount: {
            type: Number,
            default: 0,
        },
        refundReason: {
            type: String,
        },
        refundedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for common queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ templateId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;

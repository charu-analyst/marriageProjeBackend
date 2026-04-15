import mongoose from 'mongoose';
import subscriptionStatus from '../enums/subscriptionStatus.js';
mongoose.pluralize(null);
const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        planName: {
            type: String,
            enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
          
        },
        price: {
            type: Number,
            min: 0,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        billingCycle: {
            type: String,
            enum: ['MONTHLY', 'YEARLY', 'LIFETIME'],
            default: 'MONTHLY',
        },
        status: {
            type: String,
            enum: [
                subscriptionStatus.ACTIVE,
                subscriptionStatus.EXPIRED,
                subscriptionStatus.CANCELLED,
                subscriptionStatus.PENDING,
            ],
            default: subscriptionStatus.PENDING,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        renewalDate: {
            type: Date,
        },
        autoRenew: {
            type: Boolean,
            default: true,
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
        features: [{
            type: String,
        }],
        templateLimit: {
            type: Number,
            default: -1,
            description: '-1 means unlimited',
        },
        downloadLimit: {
            type: Number,
            default: -1,
            description: '-1 means unlimited',
        },
        aiCredits: {
            type: Number,
            default: 0,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Index for common queries
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;

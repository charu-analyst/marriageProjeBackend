import mongoose from 'mongoose';
mongoose.pluralize(null);
const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
        },
        discountType: {
            type: String,
            enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
        },
        discountValue: {
            type: Number,
            min: 0,
        },
        maxDiscount: {
            type: Number,
            min: 0,
            description: 'Maximum discount amount for percentage discounts',
        },
        minPurchaseAmount: {
            type: Number,
            default: 0,
        },
        maxUsage: {
            type: Number,
            default: -1,
            description: '-1 means unlimited',
        },
        currentUsage: {
            type: Number,
            default: 0,
        },
        usagePerUser: {
            type: Number,
            default: 1,
        },
        usersUsed: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            usageCount: {
                type: Number,
                default: 1,
            },
        }],
        validFrom: {
            type: Date,
        },
        validUntil: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        applicableTemplates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template',
            description: 'If empty, applies to all templates',
        }],
        applicableCategories: [String],
    },
    {
        timestamps: true,
    }
);

// Index for common queries
couponSchema.index({ code: 1 });
couponSchema.index({ validUntil: 1 });
couponSchema.index({ isActive: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;

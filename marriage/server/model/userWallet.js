import mongoose from 'mongoose';
mongoose.pluralize(null);
const userWalletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
        },
        totalEarned: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },
        transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        }],
    },
    {
        timestamps: true,
    }
);

// Index for faster lookups
userWalletSchema.index({ userId: 1 });

const UserWallet = mongoose.model('UserWallet', userWalletSchema);
export default UserWallet;

import mongoose from 'mongoose';
import templateCategory from '../enums/templateCategory.js';
mongoose.pluralize(null);
const templateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: [
                templateCategory.BIODATA,
                templateCategory.RESUME,
                templateCategory.COVER_LETTER,
                templateCategory.WEDDING_CARD,
                templateCategory.INVITATION,
            ],
        },
        thumbnail: {
            type: String,
            default: null,
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            description: 'Template structure with editable fields',
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            default: 0,
            min: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        downloads: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratings: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            score: {
                type: Number,
                min: 1,
                max: 5,
            },
            review: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        tags: [String],
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        fileUrl: {
            type: String,
            default: null,
            description: 'URL to the template file (HTML/JSON)',
        },
        previewUrl: {
            type: String,
            default: null,
        },
        version: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

// Index for better search performance
templateSchema.index({ title: 'text', description: 'text', tags: 'text' });
templateSchema.index({ category: 1, isActive: 1 });
templateSchema.index({ createdBy: 1 });
templateSchema.index({ isFeatured: 1, createdAt: -1 });
templateSchema.index({ rating: -1 });

const Template = mongoose.model('Template', templateSchema);
export default Template;
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true,
        get: function(v) {
            return `/uploads/${v}`;
        }
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    }
});

// Enable getters
resumeSchema.set('toJSON', { getters: true });
resumeSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Resume', resumeSchema);

// backend/models/EmailConfig.js
const mongoose = require('mongoose');

const EmailConfigSchema = new mongoose.Schema({
    title: { type: String, required: false },
    content: { type: String, required: false },
    footer: { type: String, required: false },
    imageUrl: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailConfig', EmailConfigSchema);

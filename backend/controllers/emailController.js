// backend/controllers/emailController.js
const fs = require('fs');
const path = require('path');
const EmailConfig = require('../models/EmailConfig');

// GET /api/getEmailLayout (already created in Step 2) 
exports.getEmailLayout = (req, res) => {
    try {
        const layoutPath = path.join(__dirname, '../views/layout.html');
        const layoutContent = fs.readFileSync(layoutPath, 'utf8');
        return res.status(200).json({ layout: layoutContent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error reading layout file.' });
    }
};

// POST /api/saveEmailConfig
exports.saveEmailConfig = async (req, res) => {
    // We'll receive { title, content, footer, imageUrl } in req.body
    try {
        const { title, content, footer, imageUrl } = req.body;

        // Create a new EmailConfig doc
        const newConfig = new EmailConfig({
            title,
            content,
            footer,
            imageUrl,
        });

        await newConfig.save();

        return res.status(200).json({
            message: 'Email config saved successfully.',
            emailConfig: newConfig,
        });
    } catch (error) {
        console.error('Error saving email config', error);
        return res.status(500).json({ message: 'Failed to save email config' });
    }
};

// (Optional) GET /api/getAllConfigs
exports.getAllConfigs = async (req, res) => {
    try {
        const configs = await EmailConfig.find().sort({ createdAt: -1 });
        return res.status(200).json({ configs });
    } catch (error) {
        console.error('Error fetching configs', error);
        return res.status(500).json({ message: 'Failed to fetch configs' });
    }
};

// (Optional) GET /api/getConfig/:id
exports.getConfigById = async (req, res) => {
    try {
        const { id } = req.params;
        const config = await EmailConfig.findById(id);
        if (!config) {
            return res.status(404).json({ message: 'Config not found' });
        }
        return res.status(200).json({ config });
    } catch (error) {
        console.error('Error fetching config', error);
        return res.status(500).json({ message: 'Failed to fetch config' });
    }
};

// (Optional) DELETE /api/deleteConfig/:id
exports.deleteConfig = async (req, res) => {
    try {
        const { id } = req.params;
        await EmailConfig.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Config deleted successfully' });
    } catch (error) {
        console.error('Error deleting config', error);
        return res.status(500).json({ message: 'Failed to delete config' });
    }
};

// In emailController.js

exports.renderTemplate = async (req, res) => {
    // The frontend can send { title, content, footer, imageUrl }
    // or we can fetch from DB by ID.
    try {
        const { title, content, footer, imageUrl } = req.body;

        // read the layout
        const layoutPath = path.join(__dirname, '../views/layout.html');
        let layoutContent = fs.readFileSync(layoutPath, 'utf8');

        // replace placeholders
        layoutContent = layoutContent
            .replace('{{title}}', title || '')
            .replace('{{content}}', content || '')
            .replace('{{footer}}', footer || '')
            .replace('{{imageUrl}}', imageUrl || '');

        // Option 1: Send as file download
        res.setHeader('Content-Disposition', 'attachment; filename="email-template.html"');
        res.setHeader('Content-Type', 'text/html');
        return res.send(layoutContent);

        // Option 2: Just send as raw HTML in JSON
        // return res.status(200).json({ html: layoutContent });

    } catch (error) {
        console.error('Error rendering template', error);
        return res.status(500).json({ message: 'Failed to render template' });
    }
};

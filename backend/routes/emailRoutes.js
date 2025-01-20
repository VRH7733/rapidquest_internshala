// backend/routes/emailRoutes.js
const express = require('express');

const fs = require('fs');
const path = require('path');

const emailController = require('../controllers/emailController');
const router = express.Router();

// GET /api/getEmailLayout
router.get('/getEmailLayout', emailController.getEmailLayout);
// emailRoutes.js
router.post('/renderTemplate', emailController.renderTemplate);


// POST /api/saveEmailConfig
router.post('/saveEmailConfig', emailController.saveEmailConfig);

// Optional: fetch all configs
router.get('/getAllConfigs', emailController.getAllConfigs);

// Optional: fetch one config by ID
router.get('/getConfig/:id', emailController.getConfigById);

// Optional: delete config by ID
router.delete('/deleteConfig/:id', emailController.deleteConfig);
// GET /api/getEmailLayout
router.get('/getEmailLayout', (req, res) => {
    try {
        // read layout.html file
        const layoutPath = path.join(__dirname, '../views/layout.html');
        const layoutContent = fs.readFileSync(layoutPath, 'utf8');

        // return as JSON
        return res.json({ layout: layoutContent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error reading layout file.' });
    }
});

module.exports = router;

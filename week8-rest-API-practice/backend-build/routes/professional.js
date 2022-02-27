const express = require('express')

const professionalController = require('../controllers/professional')

const router = express.Router()

// GET /feed/posts
router.get('/', professionalController.getProfessional)

module.exports = router
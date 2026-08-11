const express = require('express');
const router = express.Router();
const { getWorkerCategory } = require('../controllers/categoryController');

router.get('/', getWorkerCategory);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getStates, getCitiesByState } = require('../controllers/locationController');

router.get('/states', getStates);
router.get('/states/:state/cities', getCitiesByState);

module.exports = router;
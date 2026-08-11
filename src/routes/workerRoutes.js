const express = require('express');
const router = express.Router();
const {createWorkerProfile, getMyProfile,updateWorkerProfile,deleteWorkerProfile, getWorker,getWorkerbyId} = require('../controllers/workerController');
const {protect, authorize} = require('../middleware/authMiddleware');

//Create the route
router.post('/', protect, authorize('worker'), createWorkerProfile);
router.get('/myprofile', protect, authorize('worker'), getMyProfile);
router.put('/myprofile', protect, authorize('worker'), updateWorkerProfile);
router.delete('/myprofile', protect, authorize('worker'), deleteWorkerProfile);
router.get('/', getWorker);
router.get('/:id', getWorkerbyId);

module.exports = router;
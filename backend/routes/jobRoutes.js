const express = require('express');
const { allJobs, applyJob, addJob, editJob, deleteJob } = require('../controllers/jobController.js');

const { verifyToken } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.route('/').get(verifyToken, allJobs);
router.route('/addJob').post(verifyToken,addJob);
router.route('/applyJob').post(verifyToken, applyJob);
router.route('/editJob').put(verifyToken, editJob);
router.route('/deleteJob').post(verifyToken, deleteJob);

module.exports = router;
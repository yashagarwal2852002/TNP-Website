const express = require('express');
const {checkLoginStatus, registerUser, authUser, allUsers, addProject, changePassword} = require('../controllers/userController.js');

const {verifyToken} = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.route('/').get(verifyToken, allUsers);
router.route('/checkLoginStatus').get(verifyToken, checkLoginStatus);
router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/addProject').post(verifyToken, addProject);
router.route('/changePassword').post(verifyToken, changePassword);

module.exports = router;
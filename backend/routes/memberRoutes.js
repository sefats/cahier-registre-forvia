const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.post('/add', memberController.addMember);
router.get('/', memberController.getAllMembers);
router.delete('/:id', memberController.deleteMember);

module.exports = router;

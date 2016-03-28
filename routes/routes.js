var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.post('/saveexpense', actions.saveExpense);
router.get('/getinfo', actions.getinfo);
router.get('/getusers', actions.getUsers);
router.get('/getamtinfo', actions.getAmtInfo);
router.get('/getdueinfo', actions.getDueInfo);

module.exports = router;
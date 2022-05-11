const express = require('express');
const { userAuth, checkRole } = require('../controllers/auth.controller');

const router = express.Router();
const createReports = require('../controllers/report.controller');

router.post('/', async (req, res) => {
    await createReports(res);
})
module.exports = router;
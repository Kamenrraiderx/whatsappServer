const express = require('express');
const router = express.Router()
const {sendWarning,sendNotice,sendSurcharge,sendResume} = require("../controllers/testRoutes.js");



router.get('/warning',sendWarning);
router.get('/notice',sendNotice);
router.get('/surcharge',sendSurcharge)
router.get('/resume',sendResume)

module.exports = router
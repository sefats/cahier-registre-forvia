const express = require('express');
const router = express.Router();
const printPDFController = require('../controllers/printControllerPDF');

router.post('/generate-pdf', printPDFController.generateAndPrintPDF);


module.exports = router;

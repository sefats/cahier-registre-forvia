const express = require('express');
const router = express.Router();
const printController = require('../controllers/printController');
const printPDFController = require('../controllers/printControllerPDF');


router.post('/generate-zpl', printController.generateAndPrintZPL);
router.post('/generate-pdf', printPDFController.generateAndPrintPDF);


module.exports = router;

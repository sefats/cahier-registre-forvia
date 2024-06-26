const express = require('express');
const router = express.Router();

router.post("/generate-zpl", (req, res) => {
    const {
      name,
      firstname,
      email,
      phone,
      entreprise,
      contactPerson,
      startTime,
      endTime,
    } = req.body;
  
    const zpl = `
  ^XA
  ^FO50,50^A0N50,50^FDName: ${name}^FS
  ^FO50,150^A0N50,50^FDFirstname: ${firstname}^FS
  ^FO50,250^A0N50,50^FDEmail: ${email}^FS
  ^FO50,350^A0N50,50^FDPhone: ${phone}^FS
  ^FO50,450^A0N50,50^FDEntreprise: ${entreprise}^FS
  ^FO50,550^A0N50,50^FDContact Person: ${contactPerson}^FS
  ^FO50,650^A0N50,50^FDStart Time: ${new Date(startTime).toLocaleString()}^FS
  ^FO50,750^A0N50,50^FDEnd Time: ${new Date(endTime).toLocaleString()}^FS
  ^XZ
      `;
  
    res.send({ zpl });
  });
  
  module.exports = router;
  
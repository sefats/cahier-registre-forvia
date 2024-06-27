const { PDFDocument, rgb } = require("pdf-lib");
const printer = require("pdf-to-printer");
const fs = require("fs");
const path = require("path");

exports.generateAndPrintPDF = async (req, res) => {
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

  try {
    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([295.28, 216]);
    const { width, height } = page.getSize();

    // Ajouter l'image au document
    const imagePath = path.join(__dirname, "./forviafaurecia-logo.png");
    const imageBytes = fs.readFileSync(imagePath);
    const pngImage = await pdfDoc.embedPng(imageBytes);
    const pngDims = pngImage.scale(0.5);

    // Positionner l'image
    page.drawImage(pngImage, {
      x: width / 2 - pngDims.width / 2,
      y: height - pngDims.height - 10,
      width: pngDims.width,
      height: pngDims.height,
    });

    // Ajouter du texte au document
    const fontSizeLarge = 18;
    const fontSize = 11;
    const lineHeight = fontSize * 2;
    const marginXLeft = 40;
    const marginXRight = 170;
    let currentY = height - pngDims.height - 50;

    const drawText = (text, x, y, size = fontSize) => {
      page.drawText(text, {
        x: x,
        y: y,
        size: size,
        color: rgb(0, 0, 0),
      });
    };

    // Nom et prénom en haut au centre
    const nameText = `${firstname} ${name}`;
    const nameWidth = nameText.length * (fontSizeLarge * 0.5);
    drawText(nameText, width / 2 - nameWidth / 2, currentY, fontSizeLarge);
    currentY -= lineHeight * 2;

    // Informations à gauche
    let leftY = currentY;
    drawText(`${email}`, marginXLeft, leftY);
    leftY -= lineHeight;
    drawText(`${phone}`, marginXLeft, leftY);
    leftY -= lineHeight;
    drawText(`${contactPerson}`, marginXLeft, leftY);

    // Informations à droite
    let rightY = currentY;
    drawText(`${entreprise}`, marginXRight, rightY);
    rightY -= lineHeight;
    drawText(`${new Date(startTime).toLocaleString()}`, marginXRight, rightY);
    rightY -= lineHeight;
    drawText(`${new Date(endTime).toLocaleString()}`, marginXRight, rightY);

    // Enregistrer le PDF dans un fichier temporaire
    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(__dirname, "temp.pdf");
    fs.writeFileSync(pdfPath, pdfBytes);

    const options = {
      printer: "ZDesigner ZD421-203dpi ZPL", // Spécifiez le nom de votre imprimante
      scale: "fit",
      orientation: "landscape",
      win32: {
        landscape: false, // Orientation portrait
        copies: 1, // Nombre de copies
        grayscale: true, // Impression en noir et blanc
      },
      unix: {
        orientation: "portrait", // Orientation portrait
        copies: 1, // Nombre de copies
        grayscale: true, // Impression en noir et blanc
      },
    };

    // Imprimez en utilisant les options spécifiées
    await printer.print(pdfPath, options);

    // Supprimer le fichier temporaire
    fs.unlinkSync(pdfPath);

    res.json({ message: "Impression réussie" });
  } catch (err) {
    console.error(
      "Erreur lors de la génération ou de l'impression du PDF :",
      err
    );
    res.status(500).json({
      error: "Erreur lors de la génération ou de l'impression du PDF",
      details: err.message,
    });
  }
};

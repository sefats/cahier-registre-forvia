const Member = require("../models/Member");
const axios = require("axios");
const { sendZPLToPrinter } = require("./printController");

// Ajouter un membre
exports.addMember = async (req, res) => {
  const {
    sn,
    givenName,
    phone,
    mail,
    title,
    office,
    contactPerson,
    startTime,
    endTime,
  } = req.body;
  try {
    const member = await Member.create({
      sn,
      givenName,
      phone,
      mail,
      title,
      office,
      contactPerson,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    // Générer les commandes ZPL
    const response = await axios.post(
      "http://localhost:5000/api/print/generate-zpl",
      {
        name: sn,
        firstname: givenName,
        email: mail,
        phone,
        entreprise: office,
        contactPerson,
        startTime,
        endTime,
      }
    );

    const { zpl } = response.data;

    // Envoyer les commandes ZPL à l'imprimante
    sendZPLToPrinter(zpl);

    res.status(201).json({
      message: "Member visit added and label printed successfully",
      member,
    });
  } catch (error) {
    console.error("Error adding member visit:", error);
    res.status(500).json({ error: error.message });
  }
}


  // Récupérer tous les membres
  exports.getAllMembers = async (req, res) => {
    try {
      const members = await Member.findAll();
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // Supprimer un membre
  exports.deleteMember = async (req, res) => {
    const { id } = req.params;
    try {
      await Member.destroy({ where: { id } });
      res.json({ message: "Member visit deleted successfully" });
    } catch (error) {
      console.error("Error deleting member visit:", error);
      res.status(500).json({ error: error.message });
    }
  };


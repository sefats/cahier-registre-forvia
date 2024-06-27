const Visitor = require('../models/Visitor');
const axios = require('axios');
const { sendZPLToPrinter } = require('./printController');

exports.addVisitor = async (req, res) => {
  const { name, firstname, email, phone, entreprise, contactPerson, startTime, endTime } = req.body;
  try {
    const visitor = await Visitor.create({
      name,
      firstname,
      email,
      phone,
      entreprise,
      contactPerson,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });
    res.status(201).json({ message: 'Visitor added and label printed successfully', visitor });
  } catch (error) {
    console.error('Error adding visitor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer la liste des visiteurs
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.findAll();
    res.status(200).json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un visiteur
exports.deleteVisitor = async (req, res) => {
  const { id } = req.params;
  try {
    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    await visitor.destroy();
    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting visitor:', error);
    res.status(500).json({ error: error.message });
  }
};

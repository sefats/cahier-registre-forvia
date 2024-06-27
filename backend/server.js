const express = require('express');
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const memberRoutes = require('./routes/memberRoutes');
const ldapRoutes = require('./routes/ldapRoutes');
const printRoutes = require('./routes/printRoutes'); 

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/ldap', ldapRoutes);
app.use('/api/print', printRoutes); 

// Synchroniser avec la base de données MySQL
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur Node.js en cours d'exécution sur http://0.0.0.0:${PORT}`);
});

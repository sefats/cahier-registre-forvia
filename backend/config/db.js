const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cahier_registre', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
  },
  logging: false
});

module.exports = sequelize;

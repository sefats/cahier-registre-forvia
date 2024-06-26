const ldap = require('ldapjs');

// Configuration du serveur LDAP
const ldapOptions = {
  url: 'ldap://10.60.194.91:389',
};

// Configuration des informations de connexion
const baseDN = 'DC=ls,DC=ege,DC=ds';
const username = '7FRALJRECEPTION@ls.ege.ds';
const password = '@llenj0ie2023';

const client = ldap.createClient(ldapOptions);

client.on('error', (err) => {
  console.error('Erreur lors de la connexion au serveur LDAP:', err);
});

client.bind(username, password, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion au serveur LDAP:', err);
  } else {
    console.log('Connexion réussie au serveur LDAP');

    const searchAllUsers = () => {
      const opts = {
        filter: '(mail=sefa.tas@forvia.com)', // Filtre général pour récupérer toutes les entrées
        scope: 'sub', // Recherche incluant l'entrée de base et toutes ses sous-entrées
        attributes: ['cn'] // Récupérer tous les attributs disponibles
      };

      client.search(baseDN, opts, (err, res) => {
        if (err) {
          console.error('Erreur lors de la recherche:', err);
        } else {
          res.on('searchEntry', (entry) => {
            console.log('DN:', entry.dn.toString()); // Afficher le DN de l'entrée
            entry.attributes.forEach(attr => {
              console.log(`Attribute ${attr.type}: ${attr.values.join(', ')}`);
            });
          });
          res.on('searchReference', (referral) => {
            console.log('Référence:', referral.uris.join());
          });
          res.on('error', (err) => {
            console.error('Erreur de recherche:', err.message);
          });
          res.on('end', (result) => {
            console.log('Statut de la recherche:', result.status);
            client.unbind((unbindErr) => {
              if (unbindErr) {
                console.error('Erreur lors de la déconnexion:', unbindErr);
              }
            });
          });
        }
      });
    };

    searchAllUsers();
  }
});

const express = require("express");
const router = express.Router();
const ldap = require("ldapjs");

const ldapClient = ldap.createClient({
  url: 'ldap://10.60.194.91:389',
});

const adminDN = "7FRALJRECEPTION@ls.ege.ds";
const adminPassword = "@llenj0ie2023";
const baseDN = "dc=ls,dc=ege,dc=ds";

router.post("/search", (req, res) => {
  const { email } = req.body;

  console.log("Received search request for email:", email);

  ldapClient.bind(adminDN, adminPassword, (err) => {
    if (err) {
      console.error("LDAP bind failed:", err);
      return res.status(500).json({ error: "LDAP bind failed", details: err });
    }

    const opts = {
      filter: `(mail=${email})`,
      scope: "sub",
      attributes: ["*"], // Récupérer tous les attributs disponibles
    };

    ldapClient.search(baseDN, opts, (err, searchRes) => {
      if (err) {
        console.error("LDAP search failed:", err);
        return res
          .status(500)
          .json({ error: "LDAP search failed", details: err });
      }

      let entries = [];

      searchRes.on("searchEntry", (entry) => {
        console.log("Found entry:", entry.object);

        // Créer un objet propre à partir des attributs LDAP
        let user = {};
        entry.attributes.forEach((attr) => {
          user[attr.type] = attr.values;
        });

        entries.push(user);
      });

      searchRes.on("error", (err) => {
        console.error("LDAP search error:", err);
        res.status(500).json({ error: "LDAP search error", details: err });
      });

      searchRes.on("end", (result) => {
        console.log("Search finished with status:", result.status);
        res.json({ entries });
      });
    });
  });
});


module.exports = router;

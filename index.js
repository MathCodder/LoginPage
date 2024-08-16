const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "node",
    port: 3306,
  });

  connection.connect((err) => {
    if (err) {
      console.error("Erreur de connexion à la base de données:", err.stack);
      return res.send("Erreur de connexion à la base de données.");
    }
    console.log(
      "Connecté à la base de données en tant que ID " + connection.threadId
    );
  });

  connection.query(
    "SELECT * FROM users WHERE pseudo = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la requête:", err.stack);
        return res.send("Erreur lors de la requête.");
      }

      if (results.length > 0) {
        console.log("Connexion réussie !");

        res.redirect("/login");
      } else {
        console.log("Nom d'utilisateur ou mot de passe incorrect");
        res.redirect("/");
      }

      connection.end();
    }
  );
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(port, () => {
  console.log(`Serveur is Online sur le port ${port}`);
});

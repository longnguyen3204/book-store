const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "booksaw"
});

db.connect(err => {
    if (err) console.error(err);
    else console.log("MySQL connected");
});

module.exports = db;

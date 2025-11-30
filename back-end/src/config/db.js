require('dotenv').config(); 
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.log("Kết nối thất bại! Kiểm tra lại file .env.");
        return;
    }
    console.log("Kết nối MySQL thành công!");
});

module.exports = db.promise();
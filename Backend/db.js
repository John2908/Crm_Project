require('dotenv').config();
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //port: procces.env.DB_PORT,
    waitForConnections: true, // wait for a connection be
    queueLimit:0, // maxium number of connections to wa 
    connectionLimit: 10
    
});
module.exports = pool;
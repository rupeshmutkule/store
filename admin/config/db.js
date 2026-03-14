const mysql = require('mysql2');
require('dotenv').config();

const useSSL = String(process.env.DB_SSL || '').toLowerCase() === 'true' || process.env.DB_SSL === '1';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: useSSL ? { rejectUnauthorized: true } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL Connection Failed:', err.message);
    } else {
        console.log('MySQL Connected Successfully');
        connection.release();
    }
});

module.exports = pool.promise();

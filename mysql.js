const mysql = require('mysql');
const { mysqlConfig } = require('./config.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    insecureAuth: true,
});

module.exports = {
    query(sql, args) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                }
                connection.query(sql, args, (err, rows) => {
                    connection.release();
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    },
};

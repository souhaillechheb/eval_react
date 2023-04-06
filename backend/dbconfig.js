const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'stok',
    password: 'user',
    port: 5432
});
client.connect();

module.exports.Client=client
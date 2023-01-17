const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'c6o9sz8f28tXw8wZRbrJ',
  database: 'severino_db',
})

connection.connect()

module.exports = connection

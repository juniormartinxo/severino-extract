const getCSV = require('./src/csv/get-csv.js')
const connection = require('./src/database/conn')

console.log('getCSV: ', getCSV(connection))

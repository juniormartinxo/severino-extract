const util = require('util')
const fs = require('fs')
const path = require('path')

async function extractReports(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return reject(err)
      }

      // filtrar apenas arquivos com a extensão .csv
      const csvFiles = files.filter(file => path.extname(file) === '.csv')

      const promises = csvFiles.map(file => {
        const filePath = path.join(directoryPath, file)
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              return reject(err)
            }
            const lines = data.split('\n')
            // excluir a primeira linha
            const content = lines.slice(1)
            // excluir a última linha, se ela estiver vazia
            if (content[content.length - 1].trim() === '') {
              content.pop()
            }
            resolve(content)
          })
        })
      })

      Promise.all(promises)
        .then(data => {
          // juntar todos os arrays de linhas em um único array
          const combinedData = [].concat(...data)
          resolve(combinedData)
        })
        .catch(err => reject(err))
    })
  })
}

module.exports = extractReports

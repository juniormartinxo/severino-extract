const axios = require('axios')
const moment = require('moment')
const extractReports = require('./src/utils/extract-reports.js')
const utf8 = require('utf8')

moment.locale('pt-br')
;(async () => {
  const filesContent = await extractReports('reports/csv')

  filesContent.forEach(fileContent => {
    //console.log(fileContent)
    const row = fileContent.split(';')

    const docNumberREG = row[0].replaceAll('-', '')
    const docNumberBO = row[1]
    const docDateTime = row[2]
    const arrDocDateTime = docDateTime.split(' ')
    const arrDocDate = arrDocDateTime[0].split('/')
    const docDate = `${arrDocDate[2]}-${arrDocDate[1]}-${arrDocDate[0]}`
    const docTime = arrDocDateTime[1]
    const docNature = row[3]
    const docAddress = row[4]
    const docType = row[5]
    const docSituation = getSituation(row[6])
    const arrDoc = docNumberREG.split('-')
    const docAno = arrDoc[0]
    const docSeq = arrDoc[1]
    const docAtend = arrDoc[2]

    //console.log(docNumberREG)

    var data = JSON.stringify({
      number: docNumberREG,
      dateTime: `${docDate}T${docTime}`,
      date: arrDocDateTime[0],
      time: arrDocDateTime[1],
      nature_code: getNature(docNature)[0],
      nature_description: getNature(docNature)[1],
      address: docAddress,
      type: docType,
      situation: docSituation,
    })

    var config = {
      method: 'post',
      url: 'http://localhost:3000/document',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    axios(config)
      .then(function (response) {
        console.log(
          `\x1b[1m\x1b[34m  ⚡ Documento ${docNumberREG} inserido com sucesso!`,
        )
      })
      .catch(function (error) {
        console.log(
          '\x1b[2m\x1b[31m 🚨 Ocorreu um erro ao tentar inserir o registro:\n',
          `\x1b[1m\x1b[36m ${error.response.data.message}`,
          '\n',
        )
      })
  })
})()

function getNature(nature) {
  return (arrNature = nature.replace('(', '').split(') '))
}

function getSituation(situation) {
  const arrSitu = situation.split(' - ')

  return arrSitu[0].trim().toUpperCase()
}

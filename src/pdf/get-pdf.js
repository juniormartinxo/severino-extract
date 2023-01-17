const { By, Builder, Key, Select } = require('selenium-webdriver')
const util = require('util')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

const copyFilePromise = util.promisify(fs.copyFile)

require('dotenv').config()

async function getPDF(driver, delay, docAno, docSeq, docAtend) {
  const fileName = `${docAno}-${docSeq}-${docAtend}`

  console.log(`Pesquisando documento ${fileName}`)

  const url_report =
    'https://web.sids.mg.gov.br/reds/consultas/consultaAvancada.do?operation=loadForSearch&tela=CA'

  await driver.get(url_report)

  await driver.sleep(delay)

  const inputNumOcorrenciaAno = await driver.findElement(
    By.name('num_ocorrencia_ano'),
  )

  await driver.sleep(delay)

  await inputNumOcorrenciaAno.sendKeys(docAno)

  await driver.sleep(delay)

  const inputNumOcorrenciaSeq = await driver.findElement(
    By.name('num_ocorrencia_seq'),
  )

  await driver.sleep(delay)

  await inputNumOcorrenciaSeq.sendKeys(docSeq)

  await driver.sleep(delay)

  const inputNumOcorrenciaAtend = await driver.findElement(
    By.name('num_ocorrencia_atend'),
  )

  await driver.sleep(delay)

  await inputNumOcorrenciaSeq.sendKeys(docSeq)

  await driver.sleep(delay)

  const buttonConsultar = await driver.findElement(By.name('consultar')).click()

  await driver.sleep(delay)

  driver.findElement(By.name('PDF')).then(
    async element => {
      element.click()

      await driver.sleep(5000)

      const _orig = 'D:\\home\\Downloads\\relatorio.pdf'
      const _file = `D:\\apps\\severino-extract\\reports\\csv\\${fileName}.csv`

      fs.renameSync(_orig, _file, err => {
        if (err) {
          console.error(err)
          return
        }

        console.log(`Arquivo ${fileName} movido com sucesso!`)
      })
    },
    err => {
      console.log(`${fileName} não possui versão em PDF`)
    },
  )

  await driver.sleep(delay)
}

module.exports = getPDF

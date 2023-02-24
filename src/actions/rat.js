const { By, Builder, Key, Select } = require('selenium-webdriver')
const util = require('util')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

const copyFilePromise = util.promisify(fs.copyFile)

require('dotenv').config()

const data = JSON.parse(fs.readFileSync('rat.json', 'utf8'));

console.log(data.date);

exit();

async function rat(driver, delay, date, dateFileName) {
  const cities = [
    'ARAGUARI',
    'TUPACIGUARA',
    'ARAPORA',
    'INDIANOPOLIS',
    'CASCALHO RICO',
    'ESTRELA DO SUL',
    'GRUPIARA',
  ]

  for (const city of cities) {
    console.log(city)

    const url_report = process.env.SIDS_URL_REPORT_CSV      

    await driver.get(url_report)

    await driver.sleep(delay)

    const selectTipoRelatorio = await driver.findElement(
      By.name('tipoRelatorio'),
    )
    const objSelectTipoRelatorio = new Select(selectTipoRelatorio)
    const optionListTipoRelatorio = await objSelectTipoRelatorio.getOptions()
    const selectedOptionListTipoRelatorio =
      await objSelectTipoRelatorio.getAllSelectedOptions()

    await driver.sleep(delay)

    await objSelectTipoRelatorio.selectByValue('11')

    await driver.sleep(delay)

    const inputDataInicialCriacao = await driver
      .findElement(By.name('dataInicialCriacao'))
      .sendKeys(date + Key.TAB)

    await driver.sleep(2000)

    const inputDataFinalCriacao = await driver
      .findElement(By.name('dataFinalCriacao'))
      .sendKeys(date + Key.TAB)

    await driver.sleep(delay)

    const legend = await driver
      .findElement(
        By.xpath(
          "//legend[contains(text(),'Unidade Responsável pelo Registro / Unidade de Área')]",
        ),
      )
      .click()

    await driver.sleep(delay)

    const selectIdOrgaoSelecionado = await driver.findElement(
      By.name('id_orgao_selecionado'),
    )

    const objSelectIdOrgaoSelecionado = new Select(selectIdOrgaoSelecionado)
    /*
    const optionListIdOrgaoSelecionado =
    const optionListIdOrgaoSelecionado =
      await objSelectIdOrgaoSelecionado.getOptions()
    const selectedOptionListIdOrgaoSelecionado =
      await objSelectIdOrgaoSelecionado.getAllSelectedOptions()
      */

    await driver.sleep(delay)

    await objSelectIdOrgaoSelecionado.selectByValue('0')

    await driver.sleep(delay)

    const inputNomMunicipioResp = await driver.findElement(
      By.name('nom_municipio_resp'),
    )

    inputNomMunicipioResp.click()

    await driver.sleep(delay)

    inputNomMunicipioResp.sendKeys(city + Key.ENTER)

    await driver.sleep(delay)

    const selectUnidResponsavel = await driver
      .findElement(By.name('selectUnidResponsavel'))
      .click()

    const selectUnidArea = await driver
      .findElement(By.name('selectUnidArea'))
      .click()

    await driver.sleep(delay)

    const buttonConsultar = await driver
      .findElement(By.name('consultar'))
      .click()

    await driver.sleep(delay)

    driver.findElement(By.name('CSV')).then(
      async element => {
        element.click()

        await driver.sleep(5000)

        const fileName = `${city}_${dateFileName}`

        console.log(fileName)

        const _orig = 'D:\\home\\Downloads\\relatorio.csv'
        const _file = `D:\\apps\\severino-extract\\reports\\csv\\${fileName}.csv`

        fs.renameSync(_orig, _file, err => {
          if (err) {
            console.error(err)
            return
          }

          console.log('Arquivo movido com sucesso')
        })
      },
      err => {
        console.log(`${city} não possui registros`)
      },
    )

    await driver.sleep(delay)
  }
}

module.exports = rat

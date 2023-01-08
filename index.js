const { By, Builder, Key, Select } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const util = require('util')
const fs = require('fs')
const path = require('path')
const copyFilePromise = util.promisify(fs.copyFile)

;(async function index() {
  const delay = 3000

  const options = new firefox.Options()

  const driver = await new Builder()
    .setFirefoxOptions(options)
    .forBrowser('firefox')
    .build()

  const url_login =
    'https://web.sids.mg.gov.br/josso/signon/login.do?josso_cmd=login_optional&josso_back_to=http://web.sids.mg.gov.br/reds/josso_security_check&josso_partnerapp_id=reds'

  await driver.get(url_login)

  const inputLogin = await driver
    .findElement(By.name('josso_username'))
    .sendKeys('PM1211663' + Key.TAB)

  const inputPassword = await driver
    .findElement(By.name('josso_password'))
    .sendKeys('2020Robin' + Key.ENTER)

  await driver.sleep(delay)

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

    const url_report =
      'https://web.sids.mg.gov.br/reds/consultas/consultaAvancada.do?operation=loadForSearch&tela=CA'

    await driver.get(url_report)

    await driver.sleep(delay)

    const selectTipoRelatorio = await driver.findElement(
      By.name('tipoRelatorio'),
    )
    const select = new Select(selectTipoRelatorio)
    const optionList = await select.getOptions()
    const selectedOptionList = await select.getAllSelectedOptions()

    await driver.sleep(delay)

    await select.selectByValue('11')

    await driver.sleep(delay)

    const inputDataInicialFato = await driver
      .findElement(By.name('dataInicialFato'))
      .sendKeys('01/01/2023' + Key.TAB)
    const inputDataFinalFato = await driver
      .findElement(By.name('dataFinalFato'))
      .sendKeys('01/01/2023' + Key.TAB)

    await driver.sleep(delay)

    const legend = await driver
      .findElement(
        By.xpath(
          "//legend[contains(text(),'Unidade Responsável pelo Registro / Unidade de Área')]",
        ),
      )
      .click()

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

    const buttonConsultar = await driver
      .findElement(By.name('consultar'))
      .click()

    await driver.sleep(delay)

    driver.findElement(By.name('CSV')).then(
      async element => {
        element.click()

        await driver.sleep(5000)

        fs.renameSync(
          'D:\\home\\Downloads\\relatorio.csv',
          'D:\\apps\\severino\\reports\\csv\\' + city + '.csv',
          err => {
            if (err) {
              console.error(err)
              return
            }

            console.log('Arquivo movido com sucesso')
          },
        )
      },
      err => {
        console.log(`${city} não possui registros`)
      },
    )

    await driver.sleep(delay)
  }

  await driver.quit()
})()

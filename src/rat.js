import { By, Builder, Key, Select } from 'selenium-webdriver'
import firefox from 'selenium-webdriver/firefox.js'
import util from 'util'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const copyFilePromise = util.promisify(fs.copyFile)

async function rat() {
  const sids_usr = process.env.SIDS_USR ?? ''
  const sids_psw = process.env.SIDS_PSW ?? ''

  if (sids_usr === '' || sids_psw === '') {
    console.log('SIDS_USER e SIDS_PASSWORD não foi definido no arquivo .env')
    return
  }

  const delay = 3000

  const options = new firefox.Options()

  const driver = await new Builder()
    .setFirefoxOptions(options)
    .forBrowser('firefox')
    .build()

  const url_login =
    'https://web.sids.mg.gov.br/josso/signon/login.do?josso_cmd=login_optional&josso_back_to=http://web.sids.mg.gov.br/reds/josso_security_check&josso_partnerapp_id=reds'

  await driver.get(url_login)

  await driver.sleep(delay)

  const inputLogin = await driver
    .findElement(By.name('josso_username'))
    .sendKeys(sids_usr + Key.TAB)

  await driver.sleep(delay)

  const inputPassword = await driver
    .findElement(By.name('josso_password'))
    .sendKeys(sids_psw + Key.ENTER)

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

    await driver.sleep(delay)

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

    await inputNomMunicipioResp.click()

    await driver.sleep(delay)

    await inputNomMunicipioResp.sendKeys(city + Key.ENTER)

    await driver.sleep(delay)

    const objSelectOrgaoUnidDestino = await driver.findElement(
      By.name('id_orgao_unid_destino'),
    )
    const selectOrgaoUnidDestino = new Select(objSelectOrgaoUnidDestino)
    const optionListOrgaoUnidDestino = await selectOrgaoUnidDestino.getOptions()
    const selectedOptionListOrgaoUnidDestino =
      await selectOrgaoUnidDestino.getAllSelectedOptions()

    await driver.sleep(delay)

    /*

    await selectOrgaoUnidDestino.sendKeys('POLICIA MILITAR' + Key.ENTER)

    await driver.sleep(delay)
    */

    await selectOrgaoUnidDestino.selectByValue('0')

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
        await element.click()

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
}

export default rat

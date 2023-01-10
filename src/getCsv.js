import { By, Builder, Key, Select } from 'selenium-webdriver'
import util from 'util'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const copyFilePromise = util.promisify(fs.copyFile)

const getCsv = async (city, driver, options, delay, path_original_file_csv) => {
  const sids_url_report_csv = process.env.SIDS_URL_REPORT_CSV ?? ''

  if (sids_url_report_csv === '') {
    console.log('😒 A url do relatório CSV não foi definida')
    return
  }

  console.log(`🏘️ Analisando a cidade ${city}`)

  await driver.get(sids_url_report_csv)

  await driver.sleep(delay)

  const objSelectTipoRelatorio = await driver.findElement(
    By.name('tipoRelatorio'),
  )
  const selectTipoRelatorio = new Select(objSelectTipoRelatorio)
  //const optionList = await select.getOptions()
  //const selectedOptionList = await select.getAllSelectedOptions()

  await driver.sleep(delay)

  await selectTipoRelatorio.selectByValue('11')

  await driver.sleep(delay)

  const inputDataInicialFato = await driver.findElement(
    By.name('dataInicialFato'),
  )

  inputDataInicialFato.sendKeys('01/01/2023' + Key.TAB)

  await driver.sleep(delay)

  const inputDataFinalFato = await driver.findElement(By.name('dataFinalFato'))

  inputDataFinalFato.sendKeys('01/01/2023' + Key.TAB)

  await driver.sleep(delay)

  const legend = await driver.findElement(
    By.xpath(
      "//legend[contains(text(),'Unidade Responsável pelo Registro / Unidade de Área')]",
    ),
  )

  legend.click()

  await driver.sleep(delay)

  const objSelectOrgaoUnidDestino = await driver.findElement(
    By.name('id_orgao_unid_destino'),
  )
  const selectOrgaoUnidDestino = new Select(objSelectOrgaoUnidDestino)

  selectOrgaoUnidDestino.click()

  await driver.sleep(delay)

  await selectOrgaoUnidDestino.selectByValue('0')

  await driver.sleep(delay)

  const inputNomMunicipioResp = await driver.findElement(
    By.name('nom_municipio_resp'),
  )

  inputNomMunicipioResp.click()

  await driver.sleep(delay)

  inputNomMunicipioResp.sendKeys(city + Key.ENTER)

  await driver.sleep(delay)

  const selectUnidResponsavel = await driver.findElement(
    By.name('selectUnidResponsavel'),
  )

  selectUnidResponsavel.click()

  await driver.sleep(delay)

  const buttonConsultar = await driver.findElement(By.name('consultar')).click()

  await driver.sleep(6000)

  driver.findElement(By.name('CSV')).then(
    async element => {
      element.click()

      await driver.sleep(delay)

      const path_final_file_csv = path.join(`reports\\csv\\`, `${city}.csv`)

      fs.renameSync(path_original_file_csv, path_final_file_csv, err => {
        if (err) {
          console.error(err)
          return
        }

        console.log('✔️ Relatório gerado com sucesso!!!')
      })
    },
    err => {
      console.log(`❌ ${city} não possui registros`)
    },
  )
}

export default getCsv

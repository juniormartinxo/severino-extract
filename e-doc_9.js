const fs = require('fs')
const getPDF = require('./src/pdf/get-pdf.js')
//const getCSV = require('./src/get-csv.js')
//const logar = require('./src/logar.js')
const { By, Builder, Key, Select } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const { exit } = require('process')

async function e_doc() {
  const delay = 3000

  const options = new firefox.Options()
  let profile =
    'C:/Users/Martins/AppData/Roaming/Mozilla/Firefox/Profiles/lrdsmt39.default-release'
  options.setProfile(profile)

  const driver = await new Builder()
    .setFirefoxOptions(options)
    .forBrowser('firefox')
    .build()

  const sids_usr = process.env.SIDS_USR ?? ''
  const sids_psw = process.env.SIDS_PSW ?? ''

  if (sids_usr === '' || sids_psw === '') {
    console.log(
      'As variáveis SIDS_USR e SIDS_PSW não foram definidas no arquivo .env',
    )
    return
  }

  const url_login =
    'https://web.sids.mg.gov.br/josso/signon/login.do?josso_cmd=login_optional&josso_back_to=http://web.sids.mg.gov.br/reds/josso_security_check&josso_partnerapp_id=reds'

  await driver.get(url_login)

  const inputLogin = await driver
    .findElement(By.name('josso_username'))
    .sendKeys(sids_usr + Key.TAB)

  await driver.sleep(delay)

  const inputPassword = await driver
    .findElement(By.name('josso_password'))
    .sendKeys(sids_psw + Key.ENTER)

  await driver.sleep(delay)

  const directory = 'reports/csv'

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err)
      return
    }

    files = files.filter(file => file.endsWith('.csv'))

    files.map(async file => {
      const csv = fs.readFileSync(`${directory}/${file}`)
      const array = csv.toString().split('\n')
      let headers = array[0].split(';')

      const promises = array.map(async (row, index) => {
        if (index === 0) return

        let obj = {}
        let properties = row.split(';')

        const docNumberREG = properties[0]
        const docNumberBO = properties[1]
        const docDateTime = properties[2]
        const docNatureDoc = properties[3]
        const docAddressDoc = properties[4]
        const docTypeDoc = properties[5]
        const docSituation = properties[6]
        const arrDoc = docNumberREG.split('-')
        const docAno = arrDoc[0]
        const docSeq = arrDoc[1]
        const docAtend = arrDoc[2]

        if (docNumberREG !== undefined) {
          //await getPDF(driver, delay, arrDoc[0], arrDoc[1], arrDoc[2])

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

          const buttonConsultar = await driver
            .findElement(By.name('consultar'))
            .click()

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
      })

      await Promise.all(promises)
    })
  })

  await driver.quit()
}

e_doc()

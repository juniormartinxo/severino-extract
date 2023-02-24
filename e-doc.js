const fs = require('fs')
const getPDF = require('./src/pdf/get-pdf.js')

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

  const url_login = process.env.SIDS_URL_LOGIN

  await driver.get(url_login)

  const inputLogin = await driver
    .findElement(By.name(process.env.SIDS_INPUT_USER_LOGIN))
    .sendKeys(sids_usr + Key.TAB)

  await driver.sleep(delay)

  const inputPassword = await driver
    .findElement(By.name(process.env.SIDS_INPUT_USER_PSW))
    .sendKeys(sids_psw + Key.ENTER)
    //.sendKeys(sids_psw)

  await driver.sleep(delay)

  const directory = 'reports/csv'

  const promisesRead = fs.readdirSync(directory, (err, files) => {
    if (err) {
      console.error(err)
      return
    }

    files = files.filter(file => file.endsWith('.csv'))

    return files
  })

  await Promise.all(promisesRead)

  const promisesDocs = promisesRead.map(async doc => {
    const csv = fs.readFileSync(`${directory}/${doc}`)
    const lines = csv.toString().split('\n')
    let headers = lines[0].split(';')

    let n = 1

    return lines
  })

  //await Promise.all(promisesDocs)

  const docs = await Promise.all(promisesDocs)

  const promisesLines = await sequentialFor(docs)

  //await Promise.all(promisesLines)

  for (let i = 0; i < promisesLines.length; i++) {
    //const getPdf = promisesRead.map(async (fileName, index) => {
    const fileName = promisesLines[i]

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

  console.log('Todos os documentos foram pesquisados.')
}

async function sequentialFor(docs) {
  const result = []
  for (let i = 0; i < docs.length; i++) {
    let obj = {}
    let properties = docs[i].split(';')

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

    if (docs[i] === '' || i === 0) continue
    if (arrDoc.length === 3) {
      result.push(`${docAno}-${docSeq}-${docAtend}`)
    }
  }
  return result
}

e_doc()

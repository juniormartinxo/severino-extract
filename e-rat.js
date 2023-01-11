const moment = require('moment')
const rat = require('./src/rat.js')
const logar = require('./src/logar.js')
const { By, Builder, Key, Select } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')

moment.locale('pt-br')

async function e_rat() {
  const delay = 3000

  const options = new firefox.Options()

  const driver = await new Builder()
    .setFirefoxOptions(options)
    .forBrowser('firefox')
    .build()

  //await logar(driver, delay)

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

  const startDate = moment('2023-01-01')
  const endDate = moment()
  const dateRange = []

  for (let m = startDate; m.isSameOrBefore(endDate); m.add(1, 'day')) {
    dateRange.push(m.toDate())
  }

  for (const date of dateRange) {
    const newDate = moment(date).format('L')

    const dateFileName = moment(date).format('YYYY-MM-DD')

    await rat(driver, delay, newDate, dateFileName)
  }

  await driver.quit()
}

e_rat()

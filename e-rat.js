const moment = require('moment')
const rat = require('./src/actions/rat.js')
const logar = require('./src/actions/logar.js')
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

  const url_login = process.env.SIDS_URL_LOGIN


  await driver.get(url_login)

  const inputLogin = await driver
    .findElement(By.name(process.env.SIDS_INPUT_USER_LOGIN))
    .sendKeys(sids_usr + Key.TAB)

  await driver.sleep(delay)

  const inputPassword = await driver
    .findElement(By.name(process.env.SIDS_INPUT_USER_PSW))
    .sendKeys(sids_psw + Key.ENTER)

  await driver.sleep(delay)

  const startDate = moment('2023-01-16')
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

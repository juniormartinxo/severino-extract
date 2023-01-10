import { By, Builder, Key, Select } from 'selenium-webdriver'
import firefox from 'selenium-webdriver/firefox.js'
import * as dotenv from 'dotenv'
import getCsv from './src/getCsv.js'

dotenv.config()
;(async function index() {
  const sids_usr = process.env.SIDS_USR ?? ''
  const sids_psw = process.env.SIDS_PSW ?? ''

  if (sids_usr === '' || sids_psw === '') {
    console.log('SIDS_USER e SIDS_PASSWORD não foi definido no arquivo .env')
  }

  const delay = 3000

  const options = new firefox.Options()

  const driver = await new Builder()
    .setFirefoxOptions(options)
    .forBrowser('firefox')
    .build()

  const sids_url_login = process.env.SIDS_URL_LOGIN ?? ''

  if (sids_url_login === '') {
    console.log('😒 A url do login não foi definida')
  }

  await driver.get(sids_url_login)

  const inputLogin = await driver
    .findElement(By.name('josso_username'))
    .sendKeys(sids_usr + Key.TAB)

  const inputPassword = await driver
    .findElement(By.name('josso_password'))
    .sendKeys(sids_psw + Key.ENTER)

  const path_original_file_csv = process.env.PATH_ORIGINAL_FILE_CSV ?? ''

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
    await getCsv(city, driver, options, delay, path_original_file_csv)
  }

  await driver.quit()
})()

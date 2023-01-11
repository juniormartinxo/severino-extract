const fs = require('fs')
const csv = require('csvtojson')

const directory = 'reports/csv'

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error(err)
    return
  }

  files = files.filter(file => file.endsWith('.csv'))

  files.forEach(file => {
    console.log(file)

    const fs = require('fs')
    const csv = fs.readFileSync(`${directory}/${file}`)
    const array = csv.toString().split('\n')

    let result = []
    let headers = array[0].split(';')

    array.map((row, index) => {
      if (index === 0) return

      let obj = {}
      let properties = row.split(';')

      console.log(properties[0])
    })

    console.log(result)
  })
})

const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 5000

// process data
const dataString = fs.readFileSync('sample', 'utf8').split('\n')
let data = []
for (let i = 0; i < dataString.length; i++) {
  try {
    let datum = JSON.parse(dataString[i])

    if (datum.tableOrientation === 'HORIZONTAL') {
      let reversedRelation = []
      for (let j = 0; j < datum.relation[0].length; j++) {
        let row = []
        for (let i = 0; i < datum.relation.length; i++) {
          row.push(datum.relation[i][j])
        }
        reversedRelation.push(row)
      }
      datum.relation = reversedRelation
    }

    data.push(
      (({ relation, pageTitle, url, tableType, tableNum }) => ({
        relation,
        pageTitle,
        url,
        tableType,
        tableNum
      }))(datum)
    )
  } catch (e) {}
}

// endpoint for client to get data
app.get('/api/data', (req, res) => {
  res.send({ data: data })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))

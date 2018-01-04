const express = require('express')
const app = express()

app.use(express.static('./public'))
app.use(require('body-parser').json())

app.listen(process.env.PORT || 8080, () => console.log(`I'm listening.`))

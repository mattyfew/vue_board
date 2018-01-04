const express = require('express')
const app = express()

app.use(express.static('./public'))
app.use(require('body-parser').json())

app.get('/images', (req, res) => {
    console.log("in /images");
    res.json({ message: "workin on it" })
})

app.listen(process.env.PORT || 8080, () => console.log(`I'm listening.`))

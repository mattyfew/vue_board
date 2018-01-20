const express = require('express')
const app = express()
const spicedPg = require('spiced-pg')
const db = spicedPg(process.env.DATABASE_URL || require('./secrets').DATABASE_URL)


app.use(express.static('./public'))
app.use(require('body-parser').json())

app.get('/images', (req, res) => {
    const q = 'SELECT * FROM images'

    db.query(q)
        .then(results => res.json({ images: results.rows}) )
        .catch(e => console.log('There was an error with GET /images', e) )
})

app.listen(process.env.PORT || 8080, () => console.log(`I'm listening.`))

const express = require('express')
const app = express()
const spicedPg = require('spiced-pg')
const db = spicedPg(process.env.DATABASE_URL || require('./secrets').DATABASE_URL)
const bodyParser = require('body-parser')
const knox = require('knox')
const fs = require('fs')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
const favicon = require('serve-favicon')


let secrets;

if (process.env.NODE_ENV == 'production') {
    secrets = process.env
} else {
    secrets = require('./secrets.json')
}

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: secrets.BUCKET
})
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: { filesize: 2097152 }
});

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


app.get('/images', (req, res) => {
    const q = 'SELECT * FROM images'

    db.query(q)
        .then(results => res.json({ images: results.rows }) )
        .catch(e => console.log('There was an error with GET /images', e) )
})


app.post('/upload-image', uploader.single('file'), function(req, res) {
    if (req.file) {

        const { username, title, description } = req.body;

        const s3Request = client.put(req.file.filename, {
            'Content-Type': req.file.mimetype,
            'Content-Length': req.file.size,
            'x-amz-acl': 'public-read'
        })
        const readStream = fs.createReadStream(req.file.path)
        readStream.pipe(s3Request)

        s3Request.on('response', s3Response => {
            console.log("it worked?", s3Response.statusCode)
            const wasSuccessful = s3Response.statusCode == 200
            const q = 'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)'
            const params = [req.file.filename, username, title, description]

            db.query(q, params)
            .then(() => {
                console.log(req.file.filename, wasSuccessful)
                res.json({ success: wasSuccessful })
            })
            .catch((err) => {
                console.log(err)
                res.json({ success: false })
            })
        });
    } else {
        res.json({ success: false })
    }
})

app.set('port', process.env.PORT || 8080)
app.listen(app.get('port'), () => console.log(`I'm listening.`))

const express = require('express')
const app = express()
const db = require('./db/queries')
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
    secrets = require('./secrets')
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
    db.getImages().then(images => res.json({ images: images.reverse() }) )
})

app.get('/image/:imageId', (req, res) => {
    Promise.all([
        db.getSingleImage(req.params.imageId),
        db.getComments(req.params.imageId)
    ])
    .then(results => res.json({
        image: results[0],
        comments: results[1]
    }))
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
            const wasSuccessful = s3Response.statusCode == 200

            db.insertImage(req.file.filename, username, title, description)

            .then(newImage => {
                res.json({
                    success: wasSuccessful,
                    image: {
                        id: newImage.id,
                        created_at: newImage.created_at,
                        image: req.file.filename,
                        username,
                        title,
                        description
                    },
                })
            })
            .catch(err => {
                console.log("There was an error somewhere...", err)
                res.json({ success: false })
            })
        })
    } else {
        res.json({ success: false })
    }
})

app.post('/comment/:imageId', (req, res) => {
    console.log("inside POST /comment", req.body)

    db.insertComment(req.params.imageId, req.body.comment, req.body.username)
        .then(newComment => {
            console.log("successful comment insert");
            res.json({ comment: newComment })
        })
})

app.set('port', process.env.PORT || 8080)
app.listen(app.get('port'), () => console.log(`Listening on port 8080`))

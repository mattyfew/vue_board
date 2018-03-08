const spicedPg = require('spiced-pg')
const db = spicedPg(process.env.DATABASE_URL || require('../secrets').DATABASE_URL)

exports.getImages = function() {
    const q = 'SELECT * FROM images'

    return db.query(q)
        .then(results => results.rows)
        .catch(e => console.log('There was an error with GET /images', e) )
}

exports.getSingleImage = function(imageId) {
    const q = 'SELECT * FROM images WHERE id = $1'
    const params = [ imageId ]

    return db.query(q, params)
        .then(results => results.rows[0])
}

exports.insertImage = function(filename, username, title, description) {
    const q = 'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *'
    const params = [ filename, username, title, description ]

    return db.query(q, params)
        .then(results => results.rows[0])
}

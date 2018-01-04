let dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
    const { dbUser, dbPass } = require('../secrets')
    dbUrl = `postgres:${dbUser}:${dbPass}@localhost:5432/vue_board`
}

module.exports = require('spiced-pg')(dbUrl)

const mongoose = require('mongoose')

const { HOST, DB_PORT } = process.env

exports.setUpConnection = () => {
    mongoose.connect(`mongodb://${HOST}:${DB_PORT}/Notes`)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.connection.on(`error`, err => console.log(`Connection error: ${err}`))
    mongoose.connection.once(`open`, () => console.log(`DB connected`))
}
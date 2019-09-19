const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    name        : { type: String, required: true },
    color       : { type: String },
    categoryId  : { type: String, required: true  },    
})

module.exports = mongoose.model('Note', NoteSchema)
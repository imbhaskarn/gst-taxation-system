const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'accountant', 'basic'],
        default: 'basic',
        description: "role must be basic, accountant or admin"
    }
})
const User = mongoose.model('erpuser', userSchema)
module.exports = User
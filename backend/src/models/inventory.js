const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
        trim: true
    },
    SKU: {
        type: String,
        required: true,
        unique:true
    },
    quantity: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    }
}, {
    timestamps: true
})


const Inventory = mongoose.model('Inventory', inventorySchema)

module.exports = Inventory
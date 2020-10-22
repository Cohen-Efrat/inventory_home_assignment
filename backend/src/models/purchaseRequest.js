const mongoose = require('mongoose')
const Inventory = require('./inventory')

const purchaseRequestSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice:{
        type: Number,
        required: true,
    },
    completed:{
        type: Boolean,
        required:true,
        default:false
    }
}, {
    timestamps: true
});

// if the purchase Request change completed to true add the quantity to inventory
purchaseRequestSchema.pre('save', async function (next) {
    const purchase = this
    if (purchase.isModified && purchase.completed) {
        await Inventory.findOneAndUpdate({SKU:purchase.SKU},{ '$inc' :{quantity:purchase.quantity}})
    }
    next()
})

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema)

module.exports = PurchaseRequest
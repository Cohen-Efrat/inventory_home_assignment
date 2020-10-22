const express = require('express')
const inventoryModel = require('../models/inventory')
const auth = require('../middleware/auth')
const {authRole} = require('../middleware/roleVerification')
const router = new express.Router()

router.get('/inventory',auth,authRole(['Sales', 'Logistic']), async (req, res) => {
    try {
        const inventory = await inventoryModel.find()
        res.send(inventory)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/inventory/:SKU',auth,authRole(['Sales']), async (req, res) => {
    const SKU = req.params.SKU
    const updates = Object.keys(req.body)
    const allowedUpdates = ['quantity']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const inventory = await inventoryModel.findOne({SKU})
        if (!inventory) {
            return res.status(404).send()
        }
        updates.forEach((update) => inventory[update] = req.body[update])
        await inventory.save()
        res.send(inventory)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})



module.exports = router
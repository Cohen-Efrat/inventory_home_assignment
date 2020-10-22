const express = require('express')
const purchaseRequestModel = require('../models/purchaseRequest')
const auth = require('../middleware/auth')
const {authRole} = require('../middleware/roleVerification')
const router = new express.Router()


router.post('/purchases',auth,authRole(['Sales']), async (req, res) => {
    const purchase = new purchaseRequestModel({
        ...req.body,
    })
    try {
        await purchase.save()
        res.status(201).send(purchase)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/purchases',auth,authRole(['Logistic']), async (req, res) => {
    try {
        const purchases =await purchaseRequestModel.find()
        res.send(purchases)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.patch('/purchases/:id',auth,authRole(['Logistic']), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const purchase = await purchaseRequestModel.findOne({ _id:req.params.id})
        if (!purchase) {
            return res.status(404).send()
        }
        updates.forEach((update) => purchase[update] = req.body[update])
        await purchase.save()
        res.send(purchase)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router
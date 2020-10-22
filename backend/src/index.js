const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')
const inventoryRouter = require('./routers/inventory')
const purchaseRequestRouter = require('./routers/purchaseRequest')

const Inventory = require('./models/inventory')
const PurchaseRequest = require('./models/purchaseRequest')
const User = require('./models/user')
const {users, inventory, purchaseRequests} = require('./db/data')


const initData =async ()=>{
    await Inventory.insertMany(inventory);
    await PurchaseRequest.insertMany(purchaseRequests);
    //in order to use the pre save hook & hash the users passowrd
    for (let i = 0; i <users.length ; i++) {
        const user = new User(users[i])
        await user.save()
    }
}
initData()



const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json())
app.use(userRouter)
app.use(inventoryRouter)
app.use(purchaseRequestRouter)



app.listen(port, () => {
    console.log('Server is listening on port: ' + port)
})


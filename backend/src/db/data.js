// This is init data for this exercise purpose only
const users=[
    {
        name : "John Doe",
        email : "JohnDoe@gmail.com",
        password:"paSSw0rd",
        role : "Sales",
        tokens : []
    },
    {
        name : "Jane Doe",
        email : "JaneDoe@gmail.com",
        password:"paSSw0rd",
        role : "Logistic",
        tokens : [],
    }
]

const inventory=[
    {
        product: 'notebook',
        SKU: 'TA001',
        quantity: 777,
    },
    {
        product: 'pen',
        SKU: 'TA002',
        quantity: 100,
    },
    {
        product: 'sticky notes',
        SKU: 'TA003',
        quantity: 0,
    }
]

const purchaseRequests=[
    {
        completed: false,
        quantity: 500,
        SKU: 'TA001',
        unitPrice: 3,
    },
    {
        completed: false,
        quantity: 100,
        SKU: 'TA002',
        unitPrice: 0.5,
    }, {
        completed: true,
        quantity: 80,
        SKU: 'TA003',
        unitPrice: 1,
    },
    {
        completed: false,
        quantity: 30,
        SKU: 'TA003',
        unitPrice: 1,
    },
]

module.exports={
    users,
    inventory,
    purchaseRequests

}
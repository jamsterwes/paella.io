// Import and set up express app
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

// Import local database lib
const db = require('./db/database')

// Items API
const items = require('./db/items')
app.use("/api/items", items(db))

// Receipts API
const receipts = require('./db/receipts')
app.use("/api/receipts", receipts(db))

// Run application
app.use(express.static('public'))

db.getSettings("credentials.json", settings => {
    db.makeConnection(settings, () => {
        app.listen(port, () => {
            console.log(`paella.io server running on localhost:${port}`)
        })
    }, err => {
        console.log(err)
        console.log("Failed to connect to DB!")
    })
})
// Import and set up express app
const express = require('express')
const app = express()
const port = 3000

// Import local database lib
const db = require('./lib/database');

// Load data
const fs = require('fs')
var data = {}
fs.readFile('data.json', 'utf8', function(err, text) {
    data = JSON.parse(text)
})

// Items endpoint
app.get('/api/items', function(req, res) {
    db.getQuery("SELECT * FROM items").then(rows => {
        var items = {}
        rows.forEach(row => {
            items[row.id] = row;
        })
        res.json(items)
    })
})

app.get('/api/items/:itemId', function(req, res) {
    db.getQueryPrepared("SELECT * FROM items WHERE id = $1", parseInt(req.params.itemId)).then(rows => {
        res.json(rows[0])
    })
})

// Run application
app.use(express.static('public'))

db.getSettings("credentials.json", settings => {
    db.makeConnection(settings, () => {   
        app.listen(port, () => {
            console.log(`paella.io server running on localhost:${port}`)
        })
    }, err => {
        console.log(err);
        console.log("Failed to connect to DB!")
    })
})
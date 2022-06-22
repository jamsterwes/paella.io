// Import and set up express app
const express = require('express')
const app = express()
const port = 3000

// Load data
const fs = require('fs')
var data = {}
fs.readFile('data.json', 'utf8', function(err, text) {
    data = JSON.parse(text)
})

// Items endpoint
app.get('/api/items', function(req, res) {
    res.json(data.items)
})

app.get('/api/items/:itemId', function(req, res) {
    var itemId = parseInt(req.params.itemId);
    if (itemId >= data.items.length || itemId < 0) {
        res.status(404).json({
            "error": "Item not found!"
        });
    }
    res.send(data.items[req.params.itemId])
})

// Run application
app.use(express.static('public'))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
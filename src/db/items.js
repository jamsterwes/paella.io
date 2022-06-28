const express = require('express')

function hydrate(item) {
    return {
        ...item,
        remaining_stock: parseFloat(item.remaining_stock),
        unit_price: parseFloat(item.unit_price)
    }
}

function items(db) {
    var router = express.Router()

    // Get next id
    function nextID() {
        return db.query("SELECT id FROM items ORDER BY id DESC LIMIT 1")
            .then(rows => rows[0])
            .then(row => {
                if (row === undefined) return 1
                else return row.id + 1
            })
    }

    // GET / get all items
    // POST / add new item
    router.route("/")
        .get((req, res, next) => {
            db.query("SELECT * FROM items").then(rows => {
                var obj = {}
                rows.forEach(row => {
                    obj[row.id] = hydrate(row)
                })
                res.json(obj)
            })
        })
        .post(async (req, res, next) => {
            // Check for all required keys
            if (!("display_name" in req.body) || !("unit_price" in req.body) || !("by_weight" in req.body)) {
                res.status(400).json({error: "Missing required field(s)!"})
                return
            }

            var {display_name, unit_price, by_weight} = req.body
            var id = await nextID()
            db.query("INSERT INTO items (id, display_name, unit_price, by_weight) VALUES ($1, $2, $3, $4)",
                        id,
                        display_name,
                        unit_price, 
                        by_weight
            ).then(() => res.status(200).json({id}))
        })

    // GET /<id> get item
    // POST /<id> update item
    router.route("/:itemId")
        .get((req, res, next) => {
            var intID = parseInt(req.params.itemId)
            db.query("SELECT * FROM items WHERE id = $1", intID)
                .then(rows => rows[0])
                .then(item => {
                    if (item === undefined) res.status(404).json({error: "Item not found!"})
                    else res.json(hydrate(item))
                })
        })
        .post((req, res, next) => {
            // TODO: do this
        })
    
    // Return finished router
    return router
}

module.exports = items
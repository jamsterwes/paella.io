const express = require('express')

function categories(db) {
    var router = express.Router()

    // GET / get all categories
    router.route("/")
        .get(async (req, res, next) => {
            // Create id->category dict
            var obj = {}

            // Add categories to dict
            var rows = await db.query("SELECT * FROM categories")
            rows.forEach(row => {
                obj[row.id] = {...row, count: 0}
            })

            // Calculate # of items in category
            rows = await db.query("SELECT category_id, COUNT(*) as count FROM items GROUP BY category_id")
            rows.forEach(row => {
                obj[row.category_id].count = parseInt(row.count)
            })

            // Respond to client
            res.json(obj)
        })

    // POST /<id> update category
    router.route("/:catId")
        .post(async (req, res, next) => {
            var intID = parseInt(req.params.catId)

            if (!("category_color" in req.body) && !("category_name" in req.body)) {
                res.status(400).json({error: "Missing required field(s)!"})
            }

            if ("category_color" in req.body) {
                await db.query("UPDATE categories SET category_color = $2 WHERE id = $1", intID, req.body.category_color)
            }

            if ("category_name" in req.body) {
                await db.query("UPDATE categories SET category_name = $2 WHERE id = $1", intID, req.body.category_name)
            }

            var cat = (await db.query("SELECT * FROM categories WHERE id = $1", intID))[0]
            res.json(cat)
        })
    
    // Return finished router
    return router
}

module.exports = categories;
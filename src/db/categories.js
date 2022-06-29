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
    
    // Return finished router
    return router
}

module.exports = categories;
const express = require('express')

function hydrate(receipt) {
    return {lines: [], ...receipt, total: parseFloat(receipt.total)}
}

function hydrateLine(line) {
    delete line["receipt_id"]
    return {...line, quantity: parseFloat(line.quantity)}
}

function receipts(db) {
    var router = express.Router()

    // Get next id
    function nextID() {
        return db.query("SELECT id FROM receipts ORDER BY id DESC LIMIT 1")
            .then(rows => rows[0])
            .then(row => {
                if (row === undefined) return 1
                else return row.id + 1
            })
    }

    // GET / get all receipts
    // POST / add new receipt
    router.route("/")
        .get((req, res, next) => {
            // TODO: offset/limit
            db.query("SELECT * FROM receipts ORDER BY id DESC").then(receiptRows => {
                db.query("SELECT * FROM receipt_lines").then(lineRows => {
                    var obj = {}
                    receiptRows.forEach(receipt => {
                        obj[receipt.id] = hydrate(receipt)
                    })
                    lineRows.forEach(line => {
                        obj[line.receipt_id].lines.push(hydrateLine(line))
                    })
                    res.json(obj)
                })
            })
        })
        .post(async (req, res, next) => {
            // If missing keys, fail
            if (!("lines" in req.body) || !("total" in req.body) || !("is_cash" in req.body) || !("employee_id" in req.body)) {
                res.status(400).json({error: "Missing required field(s)!"})
                return
            }

            // If no lines, fail
            if (req.body.lines.length == 0) {
                res.status(400).json({error: "Cannot add receipt with 0 lines!"})
                return
            }

            // Get next receipt id
            var id = await nextID()
            
            // Add receipt header
            var {lines, total, is_cash, employee_id} = req.body

            // Create SQL promise chain
            var promise = db.query("INSERT INTO receipts (id, total, is_cash, employee_id) VALUES ($1, $2, $3, $4)",
                     id,
                     total,
                     is_cash,
                     employee_id)

            // Add each line SQL to the promise chain
            lines.forEach(line => {
                promise = promise.then(() => db.query("INSERT INTO receipt_lines (receipt_id, item_id, quantity) VALUES ($1, $2, $3)", 
                                                      id,
                                                      line.item_id,
                                                      line.quantity))
            })

            // After promise chain is over, reply with success
            promise.then(() => res.status(200).json({id}))
        })

    // GET /<id> get receipt
    // POST /<id> update receipt
    router.route("/:receiptId")
        .get((req, res, next) => {
            var intID = parseInt(req.params.receiptId)
            db.query("SELECT * FROM receipts WHERE id = $1", intID)
                .then(rows => rows[0])
                .then(receipt => {
                    if (receipt === undefined) {
                        res.status(404).json({error: "Receipt not found!"})
                    } else {
                        receipt = hydrate(receipt)

                        // Get receipt lines
                        db.query("SELECT * FROM receipt_lines WHERE receipt_id = $1", intID).then(lines => {
                            lines.forEach(line => receipt.lines.push(hydrateLine(line)))
                            res.json(receipt)
                        })
                    }
                })
        })
        .post((req, res, next) => {

        })
    
    // Return finished router
    return router
}

module.exports = receipts
// Render row in receipt (headers) table

function renderRow(receipt) {
    var template = `<tr>
    <td scope="row">${formatDBTime(receipt.transaction_date)}</td>
    <th scope="row">${receipt.employee_id}</th>
    <td scope="row">${receipt.id}</td>
    <td scope="row">${receipt.is_cash ? "Yes" : "No"}</td>
    <td scope="row">&euro;${receipt.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
    <td style="text-align: center"><button data-toggle="modal" data-target="#receiptViewModal" onclick="renderLines(${receipt.id})" class="btn btn-success border border-dark "
            id="delete-btn"><i class="fa-solid fa-eye"></i></button></td>
    <td style="text-align: center"><a class="btn btn-delete border border-dark"
            id="delete-btn" onclick="removeItem(${receipt})"><i class="fa-solid fa-trash"></i></a></td>
</tr>`

    return template
}

// Handle loading receipt headers

var receiptBody = document.getElementById("receipt-body")
var loadingBit = document.getElementById("loading-bit")

var cursor = 0

function renderItems() {
    getItems(items => {
        getCategories(categories => {
            var newHTML = ""
            Object.values(items).forEach(item => {
                newHTML += renderRow(item, categories)
            })
            inventoryBody.innerHTML = newHTML
            // Wire editable fields
            Object.values(items).forEach(item => {
                // Add editable name
                makeEditableField("item-name-" + item.id, value => {
                    // Send update to DB
                    updateItem(item.id, { display_name: value })
                    // Valid
                    return true;
                })

                // Add editable unit-price
                makeEditableField("item-unit-price-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, { unit_price: value })
                    // Valid
                    return true;
                }, display => {
                    // Convert display to input
                    return parseFloat(display.replace(",", "."))
                }, input => {
                    // Convert input to display
                    return parseFloat(input).toFixed(2).replace(".", ",")
                })

                // Add editable quantity
                makeEditableField("item-quantity-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, { quantity: value })
                    // Valid
                    return true;
                }, display => {
                    // Convert display to input
                    return parseFloat(display.replace(",", "."))
                }, input => {
                    // Convert input to display
                    return parseFloat(input).toFixed(3).replace(".", ",")
                })
            })
        })
    })
}

renderItems()

var categoryBody = document.getElementById("category-body")
var pickers = []

//Render Items

function renderItems() {
    getItems(items => {
        getCategories(categories => {
            var newHTML = ""
            Object.values(items).forEach(item => {
                newHTML += renderRow(item, categories)
            })
            inventoryBody.innerHTML = newHTML
            // Wire editable fields
            Object.values(items).forEach(item => {
                // Add editable name
                makeEditableField("item-name-" + item.id, value => {
                    // Send update to DB
                    updateItem(item.id, { display_name: value })
                    // Valid
                    return true;
                })

                // Add editable unit-price
                makeEditableField("item-unit-price-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, { unit_price: value })
                    // Valid
                    return true;
                }, display => {
                    // Convert display to input
                    return parseFloat(display.replace(",", "."))
                }, input => {
                    // Convert input to display
                    return parseFloat(input).toFixed(2).replace(".", ",")
                })

                // Add editable quantity
                makeEditableField("item-quantity-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, { quantity: value })
                    // Valid
                    return true;
                }, display => {
                    // Convert display to input
                    return parseFloat(display.replace(",", "."))
                }, input => {
                    // Convert input to display
                    return parseFloat(input).toFixed(3).replace(".", ",")
                })
            })
        })
    })
}

//remove receipt id

function removeItem(id) {
    deleteItem(id, () => {
        renderItems()
    })
}

function advanceCursor(amount) {
    cursor += amount
    if (cursor <= 0) {
        cursor = 0
        document.getElementById("prev-btn").setAttribute("disabled", "")
    } else {
        document.getElementById("prev-btn").removeAttribute("disabled")
    }

    loadingBit.style.opacity = 1
    getReceiptsCount(count => {
        console.log(count)
        if (cursor + 25 >= count) {
            document.getElementById("next-btn").setAttribute("disabled", "")
        } else {
            document.getElementById("next-btn").removeAttribute("disabled")
        }

        getReceipts(cursor, receipts => {
            receiptBody.innerHTML = ""
            Object.values(receipts).forEach(receipt => {
                receiptBody.innerHTML += renderRow(receipt)
            })
            loadingBit.style.opacity = 0
        })
    })
}

advanceCursor(0)

// Handle loading single-receipt
// Render receipt view (table + data)

function renderLines(id) {
    document.getElementById("single-receipt-body").innerHTML = ""
    document.getElementById("receiptViewModalLabel").innerText = "View Receipt #" + id

    getItems(items => {
        getReceipt(id, receipt => {
            var out = ""
            for (var line of receipt.lines) {
                var template = `
                <tr>
                    <td>${items[line.item_id].display_name}</td>
                    <td>${line.quantity.toFixed(3).replace(".", ",")} ${items[line.item_id].by_weight ? "kg" : "unit"}</td>
                    <td>&euro;${(line.quantity * items[line.item_id].unit_price).toFixed(2).replace(".", ",")}</td>
                </tr>`
                out += template + "\n"
            }
            document.getElementById("single-receipt-body").innerHTML = out
        })
    })
}
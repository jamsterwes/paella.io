function renderRow(order) {
    var template = `<tr>
    <td scope="row">${formatDBTime(order.delivery_date)}</td>
    <th scope="row">${order.id}</th>
    <td scope="row">&euro;${order.cost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
    <td scope="row">${order.received ? "Yes" : "No"}</td>
    <td style="text-align: center"><a class="btn btn-delete border border-dark"
        id="delete-btn" onclick="removeItem(${order})"><i class="fa-solid fa-trash"></i></a></td>
</tr>`

    return template
}

var orderBody = document.getElementById("order-body")
var loadingBit = document.getElementById("loading-bit")

var cursor = 0

//Render Items()

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

//Remove items for orders

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
    getOrdersCount(count => {
        console.log(count)
        if (cursor + 25 >= count) {
            document.getElementById("next-btn").setAttribute("disabled", "")
        } else {
            document.getElementById("next-btn").removeAttribute("disabled")
        }

        getOrders(cursor, orders => {
            orderBody.innerHTML = ""
            Object.values(orders).forEach(order => {
                orderBody.innerHTML += renderRow(order)
            })
            loadingBit.style.opacity = 0
        })
    })
}

advanceCursor(0)
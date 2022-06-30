function renderRow(item) {
    var unit = item.by_weight ? "kg" : "unit"
    var template = `<tr>
    <td scope="row">${item.id}</td>
    <th scope="row">${item.sales}</th>
    <td scope="row">&euro;${order.cost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
    <td style="text-align: center"><a href="" class="btn btn-lg btn-delete border border-dark "
            id="delete-btn"><i class="fa-solid fa-file-circle-xmark"></i></a></td>
    </tr>`
    
    return template
}

var orderBody = document.getElementById("order-body")
var loadingBit = document.getElementById("loading-bit")

var cursor = 0

function advanceCursor(amount) {
    cursor += amount
    if (cursor <= 0) {
        cursor = 0
        document.getElementById("prev-btn").setAttribute("disabled", "")
    } else {
        document.getElementById("prev-btn").removeAttribute("disabled")
    }

    loadingBit.style.opacity = 1
    getSalesCount(count => {
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

function isChecked(){
    console.log("hello")
    if (option1.checked) {
        document.getElementById("b-option1").classList.add("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    else if (option2.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.add("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    else if (option3.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.add("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    if (option4.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.add("active")

        document.getElementById("from").disabled = false;
        document.getElementById("to").disabled = false;
    }
    
    else if (!option4.checked) {
        document.getElementById("from").disabled = true;
        document.getElementById("to").disabled = true;
    }
}
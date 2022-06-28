var cash = true

var cashButton = document.getElementById("cash-button")
var cardButton = document.getElementById("card-button")
var productSku = document.getElementById("product-sku")
var itemQuantity = document.getElementById("item-quantity")
var checkoutBody = document.getElementById("checkout-body")

function onCash() {
    cash = true
    cashButton.classList.add("btn-primary")
    cardButton.classList.remove("btn-primary")
}

function onCard() {
    cash = false
    cashButton.classList.remove("btn-primary")
    cardButton.classList.add("btn-primary")
}

function enterButton() {
    var sku = parseInt(productSku.value)
    var quantity = parseFloat(itemQuantity.value)

    getItem(sku, function(item) {
        if (sku in order) {
            order[sku].quantity += quantity
            order[sku].subtotal = item.unit_price * order[sku].quantity
        } else {
            var line = {
                item_id: sku,
                name: item.display_name,
                unit_price: item.unit_price,
                quantity: quantity,
                subtotal: item.unit_price * quantity,
                by_weight: item.by_weight
            }
            order[sku] = line
            addReceiptLine(line)
        }
        var total = 0
        Object.values(order).forEach(line => {
            total += line.subtotal
        })
        document.getElementById("checkout-amt").innerText = total.toFixed(2).replace(".", ",")
        checkoutBody.innerHTML = ""
        Object.values(order).forEach(addReceiptLine)
    })
}

function getItem(id, callback, err) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/items/" + id, true)
    xhr.send(null)
}

function getItems(callback, err) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/items", true)
    xhr.send(null)
}

function addReceiptLine(line) {
    checkoutBody.innerHTML += "<tr> <th scope=\"row\">"
                            + line.name
                            + "</th> <td>"
                            + line.unit_price.toFixed(2).replace(".", ",")
                            + "</td> <td>"
                            + line.quantity.toFixed(2).replace(".", ",")
                            + " "
                            + (line.by_weight ? "kg" : "unit")
                            + "</td> <td>&euro"
                            + line.subtotal.toFixed(2).replace(".", ",")
                            + "</td> </tr>"
}

function addItem(id) {
    productSku.value = id.toString()
    productSku.focus()
    updateUnit(id)
    updateName(id)
}

var itemBtns = document.getElementById("item-btns")
getItems(items => {
    var i = 0
    Object.keys(items).forEach(item => {
        itemBtns.innerHTML += "<div class=\"col-md-4 mb-2\"><button class=\"btn btn-" 
                            + ((Math.floor(i/3) % 2) == 0 ? "success" : "info")
                            + "\" onclick=\"addItem("
                            + items[item].id
                            + ")\" style=\"width: 100% text-align: center\">"
                            + items[item].display_name
                            + "</button></div>"
        i += 1
    })
})

var selectedItemName = document.getElementById("selected-item-name")
var productUnit = document.getElementById("product-unit")

var skuUpdated = function() {
    var sku = parseInt(productSku.value)
    if (isNaN(sku)) {
        selectedItemName.innerText = "Invalid SKU!"
        selectedItemName.classList.add("item-marquee-err")
    } else {
        updateUnit(sku)
        updateName(sku)
    }
}

var order = {}

var addItemOnEnter = function(e) {
    if (e.keyCode === 13) {
        enterButton()
    }
}

productSku.addEventListener('keypress', addItemOnEnter)
itemQuantity.addEventListener('keypress', addItemOnEnter)

var updateUnit = function(id) {
    getItem(id, function(item) {
        productUnit.innerText = item.by_weight ? "kg" : "unit"
    }, function(err) {})
}

var updateName = function(id) {
    getItem(id, function(item) {
        selectedItemName.innerText = item.display_name
        selectedItemName.classList.remove("item-marquee-err")
    }, function(err) {
        selectedItemName.innerText = "Invalid SKU!"
        selectedItemName.classList.add("item-marquee-err")
    })
}

var calcTotal = function(items) {
    var total = 0
    items.forEach(item => {
        total += item.unit_price * item.quantity
    })
    return total
}

var checkout = function() {
    // TODO: non-hardcoded employee_id
    var receipt = {
        total: calcTotal(Object.values(order)),
        employee_id: 6,
        is_cash: cash,
        lines: Object.values(order)
    }
    
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status == 200) {
            checkoutBody.innerHTML = ""
            order = {}
            document.getElementById("checkout-amt").innerText = "0,00"
            selectedItemName.innerText = ""
            selectedItemName.classList.remove("item-marquee-err")
        }
        else console.error(xhr.status, xhr.responseText)
    }
    xhr.open("POST", "/api/receipts", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(receipt))
}
var cash = true
var order = []

var cashButton = document.getElementById("cash-button")
var cardButton = document.getElementById("card-button")
var productSku = document.getElementById("product-sku")
var itemQuantity = document.getElementById("item-quantity")

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
        order.push({
            id: sku,
            name: item.name,
            unit_price: item.unit_price,
            amount: quantity,
            subtotal: item.unit_price * quantity
        })
    })
}

function getItem(id, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        callback(JSON.parse(xhr.responseText))
    }
    xhr.open("GET", "/api/items/" + id, true)
    xhr.send(null)
}


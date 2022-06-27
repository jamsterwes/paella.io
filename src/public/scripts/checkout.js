var cash = true
var order = []

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
        var line = {
            id: sku,
            name: item.display_name,
            unit_price: item.unit_price,
            amount: quantity,
            subtotal: item.unit_price * quantity
        }
        order.push(line)
        addReceiptLine(line);
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

function getItems(callback) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        callback(JSON.parse(xhr.responseText))
    }
    xhr.open("GET", "/api/items", true)
    xhr.send(null)
}

function addReceiptLine(line) {
    checkoutBody.innerHTML += "<tr> <th scope=\"row\">" + line.name + "</th> <td>" + line.unit_price + "</td> <td>" + line.amount + " kg</td> <td>&euro;" + line.subtotal + "</td> </tr>"
}

function addItem(id) {
    productSku.value = id.toString();
}

var itemBtns = document.getElementById("item-btns");
getItems(items => {
    var i = 0;
    console.log(items);
    Object.keys(items).forEach(item => {
        itemBtns.innerHTML += "<div class=\"col-md-4 mb-2\"><button class=\"btn btn-" + ((Math.floor(i/3) % 2) == 0 ? "success" : "info") + "\" onclick=\"addItem(" + items[item].id + ")\" style=\"width: 100%; text-align: center\">" + items[item].display_name + "</button></div>";
        i += 1;
    })
})
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
    // FOR NOW SEND DUMMY DATA:
    getItems(items => {
        callback(items[id])
    })

    // var xhr = new XMLHttpRequest()
    // xhr.onload = function() {
    //     callback(JSON.parse(xhr.responseText))
    // }
    // xhr.open("GET", "/api/items/" + id, true)
    // xhr.send(null)
}

function getItems(callback) {
    // FOR NOW SEND DUMMY DATA:
    callback({"1":{"id":1,"display_name":"Candied Papaya","unit_price":"10.00","by_weight":true,"remaining_stock":"5.969"},"2":{"id":2,"display_name":"Candied Mango","unit_price":"10.00","by_weight":true,"remaining_stock":"1.586"},"3":{"id":3,"display_name":"Assorted Dry Fruits","unit_price":"11.00","by_weight":true,"remaining_stock":"43.701"},"4":{"id":4,"display_name":"Bag of Cashews","unit_price":"7.50","by_weight":false,"remaining_stock":"9.000"},"5":{"id":5,"display_name":"Cooked Lentils","unit_price":"5.00","by_weight":true,"remaining_stock":"6.578"},"6":{"id":6,"display_name":"Cooked Hook Beans","unit_price":"5.20","by_weight":true,"remaining_stock":"4.200"},"7":{"id":7,"display_name":"Cooked Chickpeas","unit_price":"6.00","by_weight":true,"remaining_stock":"7.847"},"8":{"id":8,"display_name":"Steam Vegetables","unit_price":"4.50","by_weight":true,"remaining_stock":"0.476"},"9":{"id":9,"display_name":"Steam Greens","unit_price":"4.00","by_weight":true,"remaining_stock":"2.286"},"10":{"id":10,"display_name":"Mud Bean","unit_price":"5.85","by_weight":true,"remaining_stock":"18.113"},"11":{"id":11,"display_name":"Lentils from Salamanca","unit_price":"3.30","by_weight":true,"remaining_stock":"8.085"},"12":{"id":12,"display_name":"Garbanzos Chickpeas","unit_price":"3.50","by_weight":true,"remaining_stock":"4.104"},"13":{"id":13,"display_name":"Lexos Chickpeas","unit_price":"4.00","by_weight":true,"remaining_stock":"7.505"},"14":{"id":14,"display_name":"Hook Bean","unit_price":"4.00","by_weight":true,"remaining_stock":"8.887"},"15":{"id":15,"display_name":"Golden Bean","unit_price":"6.50","by_weight":true,"remaining_stock":"1.045"},"16":{"id":16,"display_name":"Sauco Chickpeas","unit_price":"3.20","by_weight":true,"remaining_stock":"0.154"},"17":{"id":17,"display_name":"Pardina Lentils","unit_price":"2.50","by_weight":true,"remaining_stock":"16.631"},"18":{"id":18,"display_name":"Red Beans","unit_price":"3.70","by_weight":true,"remaining_stock":"1000.000"},"19":{"id":19,"display_name":"Black Eye Peas","unit_price":"3.00","by_weight":true,"remaining_stock":"18.641"},"20":{"id":20,"display_name":"White Beans","unit_price":"2.88","by_weight":true,"remaining_stock":"0.174"},"21":{"id":21,"display_name":"Beige Beans","unit_price":"2.50","by_weight":true,"remaining_stock":"2.451"},"22":{"id":22,"display_name":"Peanuts","unit_price":"0.80","by_weight":true,"remaining_stock":"10.756"},"23":{"id":23,"display_name":"Peeled Pistachios","unit_price":"2.20","by_weight":true,"remaining_stock":"5.450"},"24":{"id":24,"display_name":"Marconas","unit_price":"19.00","by_weight":true,"remaining_stock":"11.507"},"25":{"id":25,"display_name":"Mix Nuts and Fruits","unit_price":"1.20","by_weight":true,"remaining_stock":"4.719"},"26":{"id":26,"display_name":"Tiger Nut","unit_price":"9.00","by_weight":true,"remaining_stock":"9.265"},"27":{"id":27,"display_name":"Black Plums","unit_price":"12.00","by_weight":true,"remaining_stock":"6.363"},"28":{"id":28,"display_name":"Mix Raisins","unit_price":"13.00","by_weight":true,"remaining_stock":"16.038"},"29":{"id":29,"display_name":"Red Plums","unit_price":"13.00","by_weight":true,"remaining_stock":"10.427"},"30":{"id":30,"display_name":"Raisins","unit_price":"16.00","by_weight":true,"remaining_stock":"1.368"},"31":{"id":31,"display_name":"Corinto Raisins","unit_price":"8.50","by_weight":true,"remaining_stock":"14.398"},"32":{"id":32,"display_name":"White Raisin","unit_price":"10.00","by_weight":true,"remaining_stock":"0.063"},"33":{"id":33,"display_name":"Bag of Peanuts","unit_price":"1.50","by_weight":false,"remaining_stock":"5.000"},"34":{"id":34,"display_name":"Dried Chili Peppers","unit_price":"2.00","by_weight":true,"remaining_stock":"2.067"},"35":{"id":35,"display_name":"Chocolate Pieces","unit_price":"10.00","by_weight":true,"remaining_stock":"0.249"},"36":{"id":36,"display_name":"Chocolate Cover Peanuts","unit_price":"12.00","by_weight":true,"remaining_stock":"0.269"},"37":{"id":37,"display_name":"Carmel Chocolate Peanuts","unit_price":"13.00","by_weight":true,"remaining_stock":"0.093"},"38":{"id":38,"display_name":"Dried Pumpkin Seeds","unit_price":"13.00","by_weight":false,"remaining_stock":"0.000"},"39":{"id":39,"display_name":"Dried Mango","unit_price":"14.00","by_weight":true,"remaining_stock":"0.441"},"40":{"id":40,"display_name":"Dried Pineapple","unit_price":"14.00","by_weight":true,"remaining_stock":"14.661"},"41":{"id":41,"display_name":"Corn Kernels","unit_price":"10.00","by_weight":true,"remaining_stock":"0.000"},"42":{"id":42,"display_name":"Dried Figs","unit_price":"8.50","by_weight":true,"remaining_stock":"2.989"},"43":{"id":43,"display_name":"Mix Dried Fruits","unit_price":"9.00","by_weight":true,"remaining_stock":"4.396"},"44":{"id":44,"display_name":"Seafood Noodle Broth","unit_price":"2.00","by_weight":true,"remaining_stock":"19.553"},"45":{"id":45,"display_name":"Paella Broth","unit_price":"2.00","by_weight":false,"remaining_stock":"0.000"},"46":{"id":46,"display_name":"Meat Homestyle Broth","unit_price":"2.00","by_weight":false,"remaining_stock":"2.000"},"47":{"id":47,"display_name":"Fish Homestyle Broth","unit_price":"2.00","by_weight":false,"remaining_stock":"11.000"},"48":{"id":48,"display_name":"Vegetable Broth","unit_price":"1.80","by_weight":false,"remaining_stock":"0.000"},"49":{"id":49,"display_name":"Chicken Broth","unit_price":"2.00","by_weight":false,"remaining_stock":"0.000"},"50":{"id":50,"display_name":"Low Sodium Chicken Broth","unit_price":"1.80","by_weight":false,"remaining_stock":"2.000"},"51":{"id":51,"display_name":"Bowl Broth","unit_price":"2.00","by_weight":false,"remaining_stock":"14.000"},"52":{"id":52,"display_name":"Gourmet Chicken Broth","unit_price":"3.00","by_weight":false,"remaining_stock":"10.000"},"53":{"id":53,"display_name":"Gazpacho Soup","unit_price":"1.50","by_weight":true,"remaining_stock":"2.416"},"56":{"id":56,"display_name":"Hot Pockets 2","unit_price":"69.99","by_weight":false,"remaining_stock":"600.000"},"57":{"id":57,"display_name":"Hot Pocket III","unit_price":"5.00","by_weight":false,"remaining_stock":"5.000"},"58":{"id":58,"display_name":"Hotpockets II","unit_price":"45.00","by_weight":false,"remaining_stock":"114.000"},"59":{"id":59,"display_name":"Hotpockets 5","unit_price":"15.00","by_weight":false,"remaining_stock":"4.000"}})

    // var xhr = new XMLHttpRequest()
    // xhr.onload = function() {
    //     callback(JSON.parse(xhr.responseText))
    // }
    // xhr.open("GET", "/api/items", true)
    // xhr.send(null)
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
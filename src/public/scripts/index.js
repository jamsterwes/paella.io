// Formatting functions

function formatDBTime(ts, locale = 'es-ES') {
    var date = new Date(ts)
    return date.toLocaleDateString(locale) + " " + date.toLocaleTimeString(locale)
}

// TODO: money/number formatting

// DATABASE

function getOrders(start, callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/orders?limit=25&start=" + start, true)
    xhr.send(null)
}

function getOrdersCount(callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText).count)
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/orders/count", true)
    xhr.send(null)
}

function getCategories(callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/categories", true)
    xhr.send(null)
}

function getItem(id, callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/items/" + id, true)
    xhr.send(null)
}

function getItems(callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/items", true)
    xhr.send(null)
}

function setCategory(itemID, categoryID, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) renderItems()
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("POST", "/api/items/" + itemID, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify({
        category_id: categoryID
    }))
}

function updateItem(id, data, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) return;
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("POST", "/api/items/" + id, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(data))
}

function setCategoryName(name, categoryID, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) return;
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("POST", "/api/categories/" + categoryID, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify({
        category_name: name
    }))
}

function setCategoryColor(categoryColor, categoryID, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) return;
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("POST", "/api/categories/" + categoryID, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify({
        category_color: categoryColor
    }))
}

function getReceipts(start, callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/receipts?limit=25&start=" + start, true)
    xhr.send(null)
}

function getReceiptsCount(callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText).count)
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/receipts/count", true)
    xhr.send(null)
}

function sendReceipt(receipt, callback, err = console.error) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("POST", "/api/receipts", true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(receipt))
}

function makeEditableField(id, editCallback) {
    var el = document.getElementById(id);
    el.addEventListener('dblclick', () => {
        if (el.innerHTML.startsWith("<input")) return;
        value = el.innerText
        el.innerHTML = `<input class="form-control" type="text" value="${value}" />`
        var input = el.children[0]
        input.focus()
        input.setSelectionRange(0, value.length)
        
        var submit = () => {
            // Edit callback
            editCallback(input.value)
            // Update text
            el.innerHTML = input.value;
        }

        input.addEventListener('blur', submit)
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                submit()
            }
        })
    })
}
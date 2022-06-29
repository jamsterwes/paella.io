function renderRow(order) {
    var template = `<tr>
    <td scope="row">${order.delivery_date}</td>
    <th scope="row">${order.id}</th>
    <td scope="row">&euro;${order.cost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
    <td scope="row">${order.received ? "Yes" : "No"}</td>
    <td style="text-align: center"><a href="" class="btn btn-delete border border-dark "
            id="delete-btn"><i class="fa-solid fa-trash"></i></i></a></td>
</tr>`

    return template
}

function getOrders(callback, err) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/orders", true)
    xhr.send(null)
}

var orderBody = document.getElementById("order-body")

getOrders(orders => {
    console.log(orders)
    Object.values(orders).slice(-100, -1).forEach(order => {
        orderBody.innerHTML += renderRow(order)
    })
}, () => { })
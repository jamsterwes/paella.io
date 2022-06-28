function renderRow(receipt) {
    var template = `<tr>
    <td scope="row">${receipt.transaction_date}</td>
    <th scope="row">${receipt.employee_id}</th>
    <td scope="row">${receipt.id}</td>
    <td scope="row">${receipt.is_cash ? "Yes" : "No"}</td>
    <td scope="row">&euro;${receipt.total.toLocaleString('es-ES', {minimumFractionDigits: 2})}</td>
    <td style="text-align: center"><a href="" class="btn btn-delete border border-dark "
            id="delete-btn"><i class="fa-solid fa-trash"></i></i></a></td>
</tr>`

    return template
}

function getReceipts(callback, err) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/receipts", true)
    xhr.send(null)
}

var receiptBody = document.getElementById("receipt-body")

getReceipts(receipts => {
    console.log(receipts)
    Object.values(receipts).slice(-100, -1).forEach(receipt => {
        receiptBody.innerHTML += renderRow(receipt)
    })
}, () => {})
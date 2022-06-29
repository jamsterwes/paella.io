function formatDBTime(ts, locale = 'es-ES') {
    var date = new Date(ts)
    return date.toLocaleDateString(locale) + " " + date.toLocaleTimeString(locale)
}

function renderRow(receipt) {
    var template = `<tr>
    <td scope="row">${formatDBTime(receipt.transaction_date)}</td>
    <th scope="row">${receipt.employee_id}</th>
    <td scope="row">${receipt.id}</td>
    <td scope="row">${receipt.is_cash ? "Yes" : "No"}</td>
    <td scope="row">&euro;${receipt.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
    <td style="text-align: center"><a href="" class="btn btn-delete border border-dark "
            id="delete-btn"><i class="fa-solid fa-file-circle-xmark"></i></i></a></td>
</tr>`

    return template
}

function getReceipts(start, callback, err) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/receipts?limit=25&start=" + start, true)
    xhr.send(null)
}

function getReceiptsCount(callback) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText).count)
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/receipts/count", true)
    xhr.send(null)
}

var receiptBody = document.getElementById("receipt-body")
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
        }, () => { })
    })
}

advanceCursor(0)
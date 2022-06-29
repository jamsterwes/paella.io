function renderRow(receipt) {
    var template = `<tr data-toggle="modal" data-target="#receiptViewModal" onclick="renderLines(${receipt.id})">
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

async function renderLines(id) {
    var out = ""
    document.getElementById("single-receipt-body").innerHTML = ""
    document.getElementById("exampleModalLabel").innerText = "View Receipt #" + id

    var prom = new Promise(resolve => getItems(resolve))
    var items = await prom;

    getReceipt(id, async receipt => {
        for (var line of receipt.lines) {
            var template = `
            <tr>
                <td>${line.item_id}</td>
                <td>${line.quantity}</td>
                <td>&euro;${line.quantity * items[line.item_id].unit_price}</td>
            </tr>`
            out += template + "\n"
        }
        document.getElementById("single-receipt-body").innerHTML = out
    })
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
        })
    })
}

advanceCursor(0)
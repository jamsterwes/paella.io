var currency = "EUR"
var toCurrency = document.querySelector(".to")

async function renderRow(receipt) {
    var template = `<tr>
    <td scope="row">${formatDBTime(receipt.transaction_date)}</td>
    <th scope="row">${receipt.employee_id}</th>
    <td scope="row">${receipt.id}</td>
    <td scope="row">${receipt.is_cash ? "Yes" : "No"}</td>
    <td scope="row">${await formatMoney(receipt.total, currency)}</td>
    <td style="text-align: center"><a href="" class="btn btn-delete border border-dark "
            id="delete-btn"><i class="fa-solid fa-file-circle-xmark"></i></i></a></td>
</tr>`

    return template
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

        getReceipts(cursor, async receipts => {
            receiptBody.innerHTML = ""
            for (var receipt of Object.values(receipts)) {
                receiptBody.innerHTML += await renderRow(receipt)
            }
            loadingBit.style.opacity = 0
        })
    })
}

// call the event handler
// search.addEventListener('input', updateValue);
  
// function for updating value
function updateValue(e) {
    searchValue = e.target.value;
}

// Event when currency is changed
toCurrency.addEventListener('change', (event) => {
    console.log("hello")
    currency = `${event.target.value}`;
    advanceCursor(0)
})

// function for updating value
function updateValue(e) {
    searchValue = e.target.value
}

advanceCursor(0)
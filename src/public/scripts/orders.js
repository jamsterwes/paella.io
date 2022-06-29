var currency = "EUR"
var toCurrency = document.querySelector(".to")

async function renderRow(order) {
    var template = `<tr>
    <td scope="row">${formatDBTime(order.delivery_date)}</td>
    <th scope="row">${order.id}</th>
    <td scope="row">${await formatMoney(order.cost, currency)}</td>
    <td scope="row">${order.received ? "Yes" : "No"}</td>
    <td style="text-align: center"><a href="" class="btn btn-lg btn-delete border border-dark "
            id="delete-btn"><i class="fa-solid fa-file-circle-xmark"></i></a></td>
</tr>`

    return template
}

var orderBody = document.getElementById("order-body")
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
    getOrdersCount(count => {
        console.log(count)
        if (cursor + 25 >= count) {
            document.getElementById("next-btn").setAttribute("disabled", "")
        } else {
            document.getElementById("next-btn").removeAttribute("disabled")
        }

        getOrders(cursor, async orders => {
            orderBody.innerHTML = ""
            for (var order of Object.values(orders)) {
                orderBody.innerHTML += await renderRow(order)
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
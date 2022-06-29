var toCurrency = document.querySelector(".to")
const api = "https://api.exchangerate-api.com/v4/latest/USD"
var resultFrom = 'EUR'
var finalValue = document.querySelector(".finalValue")
var search = document.querySelector(".searchBox")
var resultTo
var searchValue

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

// call the event handler
search.addEventListener('input', updateValue);
  
// function for updating value
function updateValue(e) {
    searchValue = e.target.value;
}

// Event when currency is changed
toCurrency.addEventListener('change', (event) => {
    console.log("hello")
    resultTo = `${event.target.value}`;
    getResults()
})

// function for updating value
function updateValue(e) {
    searchValue = e.target.value
}
  
// function getresults
function getResults() {
    fetch(`${api}`)
        .then(currency => {
            return currency.json()
        }).then(displayResults)
}
  
// display results after convertion
function displayResults(currency) {
    let fromRate = currency.rates[resultFrom]
    let toRate = currency.rates[resultTo]
    finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(2) + " " + resultTo
    finalAmount.style.display = "block"
}

advanceCursor(0)
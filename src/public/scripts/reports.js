// {
//     "id": 18,
//     "display_name": "Red Beans",
//     "sum": 4.064,
//     "remaining_stock": 1000,
//     "total": null
// },

function renderRow(line, extras = false) {
    var template = `<tr><td scope="row">${line.display_name}</td>`
    if (extras) {
        template += `<th scope="row">${line.sum.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</th>
        <td scope="row">&euro;${line.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`
    }
    template += `</tr>`

    return template
}

var salesReportBody = document.getElementById("sales-report-body")
var excessReportBody = document.getElementById("excess-report-body")
var restockReportBody = document.getElementById("restock-report-body")

function generateReports(from, to) {
    getSalesReports(sales => {
        salesReportBody.innerHTML = ""
        for (var line of sales.sales) {
            salesReportBody.innerHTML += renderRow(line, true)
        }
    }, from, to)

    getExcessReports(excess => {
        excessReportBody.innerHTML = ""
        for (var line of excess.excess) {
            excessReportBody.innerHTML += renderRow(line)
        }
    }, from, to)

    getRestockReports(restock => {
        restockReportBody.innerHTML = ""
        for (var line of restock.restock) {
            restockReportBody.innerHTML += renderRow(line)
        }
    }, from, to)
}

function isChecked() {
    var endDate = new Date(Date.now())
    var startDate = new Date(Date.now())
    if (option1.checked) {
        startDate.setDate(startDate.getDate() - 1)
        console.log(startDate)
        console.log(endDate)
        generateReports(Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000))
        document.getElementById("b-option1").classList.add("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    else if (option2.checked) {
        startDate.setDate(startDate.getDate() - 7)
        generateReports(Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000))
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.add("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    else if (option3.checked) {
        startDate.setDate(startDate.getDate() - 30)
        generateReports(Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000))
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.add("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    if (option4.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.add("active")

        document.getElementById("from").disabled = false;
        document.getElementById("to").disabled = false;
    }

    else if (!option4.checked) {
        document.getElementById("from").disabled = true;
        document.getElementById("to").disabled = true;
    }
}
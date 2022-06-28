function renderRow(item) {
    var unit = item.by_weight ? "kg" : "unit"
    var template = `<tr>
        <th scope="row">${item.display_name}</th>
        <td>${item.unit_price.toLocaleString('es-ES', {minimumFractionDigits: 2})}</td>
        <td>${item.remaining_stock.toLocaleString('es-ES', {minimumFractionDigits: 3})} ${unit}</td>
        <td style="text-align: center">
            <!-- <a href="" class="btn btn-primary border border-dark "
                id="category-btn">Category</a> -->
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-expanded="false">
                    UNCATEGORIZED
                </button>
                <div class="dropdown-menu category-menu" aria-labelledby="dropdownMenu2">
                    <button class="dropdown-item" type="button"><span class="badge badge-secondary">Uncategorized</span></button>
                    <button class="dropdown-item" type="button"><span class="badge badge-primary">Beans</span></button>
                    <button class="dropdown-item" type="button"><span class="badge badge-success">Legumes</span></button>
                </div>
            </div>
        </td>
        <td style="text-align: center"><a href="" class="btn btn-delete border border-dark "
                id="delete-btn"><i class="fa-solid fa-trash"></i></a></td>
    </tr>`

    return template
}

function getItems(callback, err) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText))
        else err(xhr.status, xhr.responseText)
    }
    xhr.open("GET", "/api/items", true)
    xhr.send(null)
}

var inventoryBody = document.getElementById("inventory-body")

getItems(items => {
    Object.values(items).forEach(item => {
        inventoryBody.innerHTML += renderRow(item)
    })
}, () => {})
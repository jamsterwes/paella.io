function renderRow(item, categories) {
    var dropdown = renderDropdown(item, categories)
    var unit = item.by_weight ? "kg" : "unit"
    var template = `<tr>
        <th scope="row">${item.display_name}</th>
        <td>${item.unit_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
        <td>${item.remaining_stock.toLocaleString('es-ES', { minimumFractionDigits: 3 })} ${unit}</td>
        <td style="text-align: center">
            <!-- <a href="" class="btn btn-primary border border-dark "
                id="category-btn">Category</a> -->
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-expanded="false" style="background-color: ${categories[item.category_id].category_color}">
                    ${categories[item.category_id].category_name}
                </button>
                ${dropdown}
            </div>
        </td>
        <td style="text-align: center"><a href="" class="btn btn-delete border border-dark"
                id="delete-btn"><i class="fa-solid fa-trash"></i></a></td>
    </tr>`
    return template
}

function renderDropdown(item, categories) {
    var out = `<div class="dropdown-menu category-menu">`;
    Object.values(categories).forEach(category => {
        out += `<button class="dropdown-item" type="button" onclick="setCategory(${item.id}, ${category.id})"><span style="background-color: ${category.category_color}; color: white; width: 100%; text-align: left" class="badge">${category.category_name}</span></button>`;
    })
    out += `</div>`
    return out
}

var inventoryBody = document.getElementById("inventory-body")

function renderItems() {
    getItems(items => {
        getCategories(categories => {
            var newHTML = ""
            Object.values(items).forEach(item => {
                newHTML += renderRow(item, categories)
            })
            inventoryBody.innerHTML = newHTML
        })
    })
}

renderItems()
function renderRow(item, categories) {
    var dropdown = renderDropdown(item, categories)
    var unit = item.by_weight ? "kg" : "unit"
    var template = `<tr>
        <th scope="row"><div id="item-name-${item.id}">${item.display_name}</div></th>
        <td><div id="item-unit-price-${item.id}">${item.unit_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div></td>
        <td><span id="item-quantity-${item.id}">${item.remaining_stock.toLocaleString('es-ES', { minimumFractionDigits: 3 })}</span> <span id="item-unit-${item.id}">${unit}</span></td>
        <td><input type="checkbox" onclick="changeByWeight(this, ${item.id})" ${item.by_weight ? "checked" : ""} /></td>
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

function changeByWeight(el, id) {
    var byWeight = el.checked
    updateItem(id, {by_weight: byWeight})
    if (byWeight) {
        document.getElementById("item-unit-" + id).innerText = "kg"
    } else {
        document.getElementById("item-unit-" + id).innerText = "unit"
    }
}

function renderCategory(category) {
    var template = `<tr>
        <th scope="row"><div id="cat-name-${category.id}">${category.category_name}</div></th>
        <td><div id="color-picker-cat${category.id}"></div></td>
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
            // Wire editable fields
            Object.values(items).forEach(item => {
                // Add editable name
                makeEditableField("item-name-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, {display_name: value})
                    // Valid
                    return true;
                })
                
                // Add editable unit-price
                makeEditableField("item-unit-price-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, {unit_price: value})
                    // Valid
                    return true;
                }, display => {
                    // Convert display to input
                    return parseFloat(display.replace(",", "."))
                }, input => {
                    // Convert input to display
                    return parseFloat(input).toFixed(2).replace(".", ",")
                })
                
                // Add editable quantity
                makeEditableField("item-quantity-" + item.id, value => {
                    // Check for invalid
                    if (isNaN(value)) return false;
                    // Send update to DB
                    updateItem(item.id, {quantity: value})
                    // Valid
                    return true;
                }, display => {
                    // Convert display to input
                    return parseFloat(display.replace(",", "."))
                }, input => {
                    // Convert input to display
                    return parseFloat(input).toFixed(3).replace(".", ",")
                })
            })
        })
    })
}

renderItems()

var categoryBody = document.getElementById("category-body")
var pickers = []

function renderCategories() {
    getCategories(categories => {
        var newHTML = ""
        Object.values(categories).forEach(category => {
            newHTML += renderCategory(category)
        })
        categoryBody.innerHTML = newHTML

        Object.values(categories).forEach(category => {
            // Add editable name
            makeEditableField("cat-name-" + category.id, value => {
                // Send update to DB
                setCategoryName(value, category.id)
            })

            // Add color picker
            var picker = Pickr.create({
                el: '#color-picker-cat' + category.id,
                theme: 'nano', // or 'monolith', or 'nano'
                default: category.category_color,
                comparison: false,
                components: {
                    // Main components
                    preview: true,
                    hue: true,
            
                    // Input / output Options
                    interaction: {
                        hex: false,
                        rgba: false,
                        hsla: false,
                        hsva: false,
                        cmyk: false,
                        input: false,
                        clear: false,
                        save: false
                    }
                }
            })
            picker.on('changestop', (source, instance) => {
                setCategoryColor(picker.getColor().toHEXA().toString(), category.id)
                renderItems()
            })
            pickers.push(picker)
        })
    })
}

renderCategories()
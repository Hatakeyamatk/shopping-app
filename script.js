const input = document.getElementById("itemInput");
const button = document.getElementById("addButton");
const list = document.getElementById("shoppingList");

let items = JSON.parse(localStorage.getItem("shoppingItems")) || [];

function saveItems() {
    localStorage.setItem("shoppingItems", JSON.stringify(items));
}

function renderItems() {
    list.innerHTML = "";

    items.forEach(function (item, index) {
        const li = document.createElement("li");

        const itemText = document.createElement("span");
        itemText.textContent = item;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";

        deleteButton.addEventListener("click", function () {
            items.splice(index, 1);
            saveItems();
            renderItems();
        });

        li.appendChild(itemText);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

button.addEventListener("click", function () {
    if (input.value === "") {
        return;
    }

    items.push(input.value);
    saveItems();
    renderItems();

    input.value = "";
});

renderItems();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCLnSqWs7yvU6Fs7JbQFGxvhI2KAWECPUI",
    authDomain: "shopping-app-62aad.firebaseapp.com",
    projectId: "shopping-app-62aad",
    storageBucket: "shopping-app-62aad.firebasestorage.app",
    messagingSenderId: "673481791394",
    appId: "1:673481791394:web:56b09fdb11bf6d9ba204fb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const input = document.getElementById("itemInput");
const button = document.getElementById("addButton");
const list = document.getElementById("shoppingList");

const itemsRef = collection(db, "shoppingItems");

button.addEventListener("click", async function () {
    const itemName = input.value.trim();

    if (itemName === "") {
        return;
    }

    await addDoc(itemsRef, {
        name: itemName,
        createdAt: serverTimestamp()
    });

    input.value = "";
});

onSnapshot(itemsRef, function (snapshot) {
    list.innerHTML = "";

    snapshot.forEach(function (docItem) {
        const item = docItem.data();

        const li = document.createElement("li");

        const itemText = document.createElement("span");
        itemText.textContent = item.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";

        deleteButton.addEventListener("click", async function () {
            await deleteDoc(doc(db, "shoppingItems", docItem.id));
        });

        li.appendChild(itemText);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
});
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

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const input = document.getElementById("itemInput");
const button = document.getElementById("addButton");
const list = document.getElementById("shoppingList");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userInfo = document.getElementById("userInfo");
const appArea = document.getElementById("appArea");

const itemsRef = collection(db, "shoppingItems");

loginButton.addEventListener("click", async function () {
    await signInWithPopup(auth, provider);
});

logoutButton.addEventListener("click", async function () {
    await signOut(auth);
});

button.addEventListener("click", async function () {
    const itemName = input.value.trim();

    if (itemName === "") {
        return;
    }

    await addDoc(itemsRef, {
        name: itemName,
        createdAt: serverTimestamp(),
        addedBy: auth.currentUser.displayName
    });

    input.value = "";
});

onAuthStateChanged(auth, function (user) {
    if (user) {
        userInfo.textContent = user.email + " でログイン中";
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        appArea.style.display = "block";

        onSnapshot(itemsRef, function (snapshot) {
            list.innerHTML = "";

            snapshot.forEach(function (docItem) {
                const item = docItem.data();

                const li = document.createElement("li");

                const itemText = document.createElement("span");
                const userName = item.addedBy || "不明";

                itemText.textContent = `${item.name}（${userName}）`;

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

    } else {
        userInfo.textContent = "ログインしてください";
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
        appArea.style.display = "none";
        list.innerHTML = "";
    }
});
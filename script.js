import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1D2xYJ5egUk13q-bRs7OaejQhIHTKr7Q",
    authDomain: "area-finder-540ae.firebaseapp.com",
    projectId: "area-finder-540ae",
    storageBucket: "area-finder-540ae.firebasestorage.app",
    messagingSenderId: "908056736195",
    appId: "1:908056736195:web:97e8af6311c511bdf4cd76"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const residentCollection = collection(db, "residents");

window.db = db;
window.residentCollection = residentCollection;

window.firebaseFunctions = {
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
};

console.log("✅ Firebase Connected!");
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1D2xYJ5egUk13q-bRs7OaejQhIHTKr7Q",
    authDomain: "area-finder-540ae.firebaseapp.com",
    projectId: "area-finder-540ae",
    storageBucket: "area-finder-540ae.firebasestorage.app",
    messagingSenderId: "908056736195",
    appId: "1:908056736195:web:97e8af6311c511bdf4cd76"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const residentCollection = collection(db, "residents");

let records = [];
let editingId = null; // We use ID instead of acc
function renderTable(data) {
    const tableBody = document.getElementById("directoryTable");
    const noResults = document.getElementById("noResults");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        noResults.style.display = "block";
        return;
    }
    noResults.style.display = "none";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><span class="badge">${item.acc}</span></td>
            <td>${item.name}</td>
            <td>${item.address}</td>
            <td>Block ${item.block}</td>
            <td>Lot ${item.lot}</td>
            <td>
                <button class="btn-edit" data-id="${item.id}">Edit</button>
                <button class="btn-delete" data-id="${item.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateAddressCount(data) {
    const countBox = document.getElementById("addressCount");
    if (countBox) countBox.innerHTML = "Total Consumers: " + data.length;
}
// Real-time listener for multi-PC syncing
onSnapshot(residentCollection, (snapshot) => {
    records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable(records);
    updateAddressCount(records);
});

async function saveRecord(event) {
    event.preventDefault();
    const resident = {
        acc: document.getElementById("accNum").value,
        name: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        block: document.getElementById("block").value,
        lot: document.getElementById("lot").value
    };

    if (editingId) {
        await updateDoc(doc(db, "residents", editingId), resident);
        editingId = null;
    } else {
        await addDoc(residentCollection, resident);
    }
    toggleModal(false);
}

async function deleteRecord(id) {
    if (confirm("Delete this resident?")) {
        await deleteDoc(doc(db, "residents", id));
    }
}
function toggleModal(show) {
    const modal = document.getElementById("addModal");
    if (show) {
        modal.classList.add("active");
    } else {
        modal.classList.remove("active");
        editingId = null;
        document.getElementById("addForm").reset();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".btn-add").addEventListener("click", () => toggleModal(true));
    document.getElementById("addForm").addEventListener("submit", saveRecord);

    // Event Delegation for Edit/Delete buttons (necessary for dynamic content)
    document.getElementById("directoryTable").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-delete")) {
            deleteRecord(e.target.dataset.id);
        } else if (e.target.classList.contains("btn-edit")) {
            const id = e.target.dataset.id;
            const res = records.find(r => r.id === id);
            editingId = id;
            document.getElementById("accNum").value = res.acc;
            document.getElementById("fullName").value = res.name;
            document.getElementById("address").value = res.address;
            document.getElementById("block").value = res.block;
            document.getElementById("lot").value = res.lot;
            toggleModal(true);
        }
    });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore(initializeApp({
    apiKey: "AIzaSyD1D2xYJ5egUk13q-bRs7OaejQhIHTKr7Q",
    projectId: "area-finder-540ae",
    // ... add remaining config ...
}));

let records = [];
let editingId = null;

// UI Elements
const table = document.getElementById("directoryTable");
const modal = document.getElementById("addModal");

// Firebase Real-time
onSnapshot(collection(db, "residents"), (snap) => {
    records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    render(records);
    updateFilters();
});

function render(data) {
    table.innerHTML = data.map(r => `<tr>
        <td><span class="badge">${r.acc}</span></td><td>${r.name}</td><td>${r.address}</td>
        <td>Block ${r.block}</td><td>Lot ${r.lot}</td>
        <td><button class="btn-edit" onclick="edit('${r.id}')">Edit</button><button class="btn-delete" onclick="del('${r.id}')">Delete</button></td>
    </tr>`).join('');
    document.getElementById("addressCount").innerText = `Total Consumers: ${data.length}`;
}

// Logic
window.edit = (id) => {
    const r = records.find(x => x.id === id);
    editingId = id;
    Object.keys(r).forEach(k => { if(document.getElementById(k)) document.getElementById(k).value = r[k]; });
    modal.classList.add("active");
};

window.del = (id) => { if(confirm("Delete resident?")) deleteDoc(doc(db, "residents", id)); };

document.getElementById("addForm").onsubmit = async (e) => {
    e.preventDefault();
    const data = { acc: document.getElementById("accNum").value, name: document.getElementById("fullName").value, address: document.getElementById("address").value, block: document.getElementById("block").value, lot: document.getElementById("lot").value };
    editingId ? await updateDoc(doc(db, "residents", editingId), data) : await addDoc(collection(db, "residents"), data);
    modal.classList.remove("active");
    e.target.reset();
};

document.getElementById("searchInput").oninput = (e) => {
    const val = e.target.value.toLowerCase();
    render(records.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(val))));
};

document.getElementById("openModal").onclick = () => modal.classList.add("active");
document.getElementById("closeModal").onclick = () => modal.classList.remove("active");

function updateFilters() {
    const filter = document.getElementById("addressFilter");
    const unique = [...new Set(records.map(r => r.address))];
    filter.innerHTML = '<option value="">All Addresses</option>' + unique.map(a => `<option value="${a}">${a}</option>`).join('');
}
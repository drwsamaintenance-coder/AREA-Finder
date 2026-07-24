import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const db = getFirestore(initializeApp({
    apiKey: "AIzaSyD1D2xYJ5egUk13q-bRs7OaejQhIHTKr7Q",
    projectId: "area-finder-540ae",
}));


let records = [];
let editingId = null;


// UI Elements
const table = document.getElementById("directoryTable");
const modal = document.getElementById("addModal");
const addressFilter = document.getElementById("addressFilter");
const searchInput = document.getElementById("searchInput");
const addressCount = document.getElementById("addressCount");


// ===============================
// MASTER DATA ARRAY FOR BULK UPLOAD
// ===============================
const accountsData = [
  {
    "accountNo": "KAN2015-0001MA",
    "name": "Ma. Theresa Amurao",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0002MA",
    "name": "Marivic Amurao",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0003LP",
    "name": "Levy Palacios",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0004CA",
    "name": "Cirila Alcala",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2018-0005AL",
    "name": "Alexander Lanting",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0006AL",
    "name": "Angeline Lumban",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0007MR",
    "name": "Melecia T. Ramilo",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0008DL",
    "name": "Dominador Lumban",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2026-1194LM",
    "name": "Leonila R. Mendoza",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0009RM",
    "name": "Remedios Magsino",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2026-1193NO",
    "name": "Nenita D. Opulencia",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0010CO",
    "name": "Celedonia Opulencia",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0011LO",
    "name": "Loricel Opulencia",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0012AO",
    "name": "Arturo Opulencia",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0013RM",
    "name": "Richard Morales",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0014RM",
    "name": "Rosario Morales",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0015MV",
    "name": "Ma. Cristina Villegas",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0016JV",
    "name": "Jane Villegas",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0017EV",
    "name": "Erminda Villegas",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2020-0018DV",
    "name": "Donald L. Villegas",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2021-0019AV",
    "name": "Avelino Dennis L. Villegas",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2021-0020BB",
    "name": "Bernie G. Blastique",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2024-0021FF",
    "name": "Fidel F. Fano",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2024-0022FF",
    "name": "Fidel F. Fano I",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2024-0023FF",
    "name": "Fidel F. Fano II",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0024EM",
    "name": "Eleuterio Magsino",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0025HM",
    "name": "Helen Grace Magsino",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0026GM",
    "name": "German Maiquez orig",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0027JJ",
    "name": "Jaime Jimena",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0028RP",
    "name": "Rafael Pecho",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0029DU",
    "name": "Delfin Unigo",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0030SD",
    "name": "Sergio dela Cueva",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0031VD",
    "name": "Virgilio dela Cueva",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0032RG",
    "name": "Ryan Carlo Gunnacao",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0033MD",
    "name": "Marites dela Cueva",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0034ED",
    "name": "Edmer dela Cueva",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0035JM",
    "name": "Josephine Magsino",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0036ED",
    "name": "Elvira dela Cueva",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0037BT",
    "name": "Ben Tablar",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0039EM",
    "name": "Eusebio Magsino",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0040GC",
    "name": "Glenda Capino",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0041MT",
    "name": "Milagros Tan",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0042NL",
    "name": "Nerissa Lorca",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0043KS",
    "name": "Klarisse Ann Serrado",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0044BG",
    "name": "Benjamin Gunnacao",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0045FG",
    "name": "Francisco Guevarra",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0046AD",
    "name": "Arlene dela Cueva 1",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  },
  {
    "accountNo": "KAN2015-0047JD",
    "name": "Juanito dela Cueva",
    "address": "Kanluran",
    "block": "",
    "lot": ""
  }
];


// ===============================
// FIREBASE REAL TIME DATA
// ===============================

onSnapshot(collection(db, "residents"), (snap) => {
    records = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }));

    updateFilters();
    filterRecords();
});



// ===============================
// DISPLAY TABLE
// ===============================

function render(data) {
    table.innerHTML = data.map(r => `
        <tr>
            <td>${r.acc}</td>
            <td>${r.name}</td>
            <td>${r.address}</td>
            <td>Block ${r.block}</td>
            <td>Lot ${r.lot}</td>
            <td>
                <button class="btn-edit" onclick="edit('${r.id}')">
                    Edit
                </button>
                <button class="btn-delete" onclick="del('${r.id}')">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");

    addressCount.innerText = `Total Consumers: ${data.length}`;
}




// ===============================
// SEARCH + ADDRESS FILTER
// ===============================

function filterRecords(){
    const searchValue = searchInput.value.toLowerCase();
    const selectedAddress = addressFilter.value;

    const filtered = records.filter(r => {
        const matchesSearch =
            Object.values(r)
            .some(value =>
                String(value)
                .toLowerCase()
                .includes(searchValue)
            );

        const matchesAddress =
            selectedAddress === "" ||
            r.address === selectedAddress;

        return matchesSearch && matchesAddress;
    });

    render(filtered);
}

searchInput.oninput = filterRecords;
addressFilter.onchange = filterRecords;




// ===============================
// CREATE / UPDATE RECORD
// ===============================

document.getElementById("addForm").onsubmit = async (e)=>{
    e.preventDefault();

    const data = {
        acc: document.getElementById("accNum").value,
        name: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        block: document.getElementById("block").value,
        lot: document.getElementById("lot").value
    };

    if(editingId){
        await updateDoc(
            doc(db,"residents",editingId),
            data
        );
        editingId = null;
    }else{
        await addDoc(
            collection(db,"residents"),
            data
        );
    }

    modal.classList.remove("active");
    e.target.reset();
};




// ===============================
// EDIT (Exposed globally for HTML onclick)
// ===============================

function edit(id){
    const r = records.find(x=>x.id===id);
    if (!r) return;
    editingId = id;

    document.getElementById("accNum").value = r.acc;
    document.getElementById("fullName").value = r.name;
    document.getElementById("address").value = r.address;
    document.getElementById("block").value = r.block;
    document.getElementById("lot").value = r.lot;

    modal.classList.add("active");
}

window.edit = edit;




// ===============================
// DELETE (Exposed globally for HTML onclick)
// ===============================

async function del(id){
    if(confirm("Delete resident?")){
        await deleteDoc(
            doc(db,"residents",id)
        );
    }
}

window.del = del;




// ===============================
// BATCH UPLOAD FUNCTIONS (Exposed for Console)
// ===============================

// 1. Manual chunk upload function (e.g., uploadBatch(0, 50))
async function uploadBatch(start, end) {
    console.log(`Running batch upload from index ${start} to ${end}...`);
    
    if (typeof accountsData === 'undefined') {
        console.error("accountsData is not defined!");
        return;
    }

    const dataSlice = accountsData.slice(start, end);
    for (const record of dataSlice) {
        await addDoc(collection(db, "residents"), record);
    }
    console.log("Batch upload complete!");
}
window.uploadBatch = uploadBatch;


// 2. Fully automated background upload function for ALL data at once
async function uploadAllData(chunkSize = 50) {
    if (typeof accountsData === 'undefined' || !accountsData.length) {
        console.error("accountsData is missing or empty!");
        return;
    }

    console.log(`Starting mass upload for ${accountsData.length} total records...`);

    for (let i = 0; i < accountsData.length; i += chunkSize) {
        const batch = accountsData.slice(i, i + chunkSize);
        const endRange = Math.min(i + chunkSize, accountsData.length);
        
        console.log(`Processing records ${i} to ${endRange}...`);

        try {
            for (const record of batch) {
                await addDoc(collection(db, "residents"), record);
            }
            // 1-second delay between chunks to protect your connection/database limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error uploading batch starting at index ${i}:`, error);
        }
    }

    console.log("Mass upload completed for all records!");
}
window.uploadAllData = uploadAllData;




// ===============================
// MODAL
// ===============================

document.getElementById("openModal").onclick = ()=>{
    modal.classList.add("active");
};

document.getElementById("closeModal").onclick = ()=>{
    modal.classList.remove("active");
};




// ===============================
// ADDRESS DROPDOWN
// ===============================

function updateFilters(){
    const current = addressFilter.value;

    const uniqueAddresses =
        [...new Set(
            records.map(r=>r.address)
        )];

    addressFilter.innerHTML =
        `<option value="">
            All Addresses
        </option>` +
        uniqueAddresses.map(address =>
            `<option value="${address}">
                ${address}
            </option>`
        ).join("");

    if(uniqueAddresses.includes(current)){
        addressFilter.value = current;
    }
}
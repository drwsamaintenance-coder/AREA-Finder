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
async function uploadNewDataOnly() {
  console.log(`Starting smart upload check for ${newResidentsData.length} records...`);
  
  let addedCount = 0;
  let skippedCount = 0;

  for (const item of newResidentsData) {
    try {
      // 1. Check if the accountNo already exists in Firestore
      const q = window.firebaseQuery(
        window.firebaseCollection(window.db, "residents"), 
        window.firebaseWhere("accountNo", "==", item.accountNo)
      );
      const querySnapshot = await window.firebaseGetDocs(q);

      // 2. If it already exists, skip it
      if (!querySnapshot.empty) {
        skippedCount++;
        console.log(`Skipped existing record: ${item.accountNo} (${item.name})`);
        continue;
      }

      // 3. If it doesn't exist, upload it
      await window.firebaseAddDoc(window.firebaseCollection(window.db, "residents"), {
        accountNo: item.accountNo,
        name: item.name,
        address: item.address,
        block: item.block,
        lot: item.lot
      });
      
      addedCount++;
      console.log(`Uploaded new record: ${item.accountNo} (${item.name})`);

    } catch (error) {
      console.error(`Error processing record ${item.accountNo}:`, error);
    }
  }

  console.log(`Upload finished! Added: ${addedCount}, Skipped (already exist): ${skippedCount}`);
}

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
    "accountNo": "AM2019-0001RD",
    "name": "Reynaldo A. Dalisay 1",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "3"
  },
  {
    "accountNo": "AM2019-0002RD",
    "name": "Reynaldo A. Dalisay 2",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "3"
  },
  {
    "accountNo": "AM2019-0003RD",
    "name": "Reynaldo A. Dalisay 3",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "3"
  },
  {
    "accountNo": "AM2017-0005FB",
    "name": "Fe Buño",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "6"
  },
  {
    "accountNo": "AM2017-0006NC",
    "name": "Nerisa P. Catajay",
    "address": "Amare Homes",
    "block": "1b",
    "lot": "15"
  },
  {
    "accountNo": "AM2016-0008AM",
    "name": "Angelita Mercado",
    "address": "Amare Homes",
    "block": "1b",
    "lot": "17"
  },
  {
    "accountNo": "AM2021-0009JD",
    "name": "John Mark L. del Rosario",
    "address": "Amare Homes",
    "block": "1",
    "lot": "18"
  },
  {
    "accountNo": "AM2024-0010JI",
    "name": "Jonah Micah N. Insao",
    "address": "Amare Homes",
    "block": "1",
    "lot": "19"
  },
  {
    "accountNo": "AM2016-0011JL",
    "name": "Jo Antoinette Grace L. Loar",
    "address": "Amare Homes",
    "block": "1b",
    "lot": "20"
  },
  {
    "accountNo": "AM2016-0012GM",
    "name": "Granny R. Magnaye",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "22"
  },
  {
    "accountNo": "AM2015-0013FC",
    "name": "Felicela Castillo",
    "address": "Amare Homes",
    "block": "1b",
    "lot": "23"
  },
  {
    "accountNo": "AM2020-0014PP",
    "name": "Prince Jayvene D. Perez",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "24"
  },
  {
    "accountNo": "AM2023-0015JO",
    "name": "Jerome E. Obliopas",
    "address": "Amare Homes",
    "block": "1",
    "lot": "25"
  },
  {
    "accountNo": "AM2019-0016DE",
    "name": "Desiree M. Espiritu",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "26"
  },
  {
    "accountNo": "AM2025-0109EG",
    "name": "Erika Goh",
    "address": "Amare Homes",
    "block": "1b",
    "lot": "27"
  },
  {
    "accountNo": "AM2017-0017SS",
    "name": "Sonia A. Silva",
    "address": "Amare Homes",
    "block": "1b",
    "lot": "28"
  },
  {
    "accountNo": "AM2015-0018MP",
    "name": "Manny Platon",
    "address": "Amare Homes",
    "block": "2",
    "lot": "4"
  },
  {
    "accountNo": "AM2019-0020DL",
    "name": "Dolores P. Libuit",
    "address": "Amare Homes",
    "block": "9",
    "lot": "14"
  },
  {
    "accountNo": "AM2020-0021DL",
    "name": "Dolores P. Libuit I",
    "address": "Amare Homes",
    "block": "9",
    "lot": "17"
  },
  {
    "accountNo": "AM2020-0086DL",
    "name": "Dolores P. Libuit II",
    "address": "Amare Homes",
    "block": "9",
    "lot": "17"
  },
  {
    "accountNo": "AM2021-0088DL",
    "name": "Dolores P. Libuit IV",
    "address": "Amare Homes",
    "block": "9",
    "lot": "17"
  },
  {
    "accountNo": "AM2021-0022RF",
    "name": "Ronald M. Florendo",
    "address": "Amare Homes",
    "block": "8a",
    "lot": "1"
  },
  {
    "accountNo": "AM2021-0023CM",
    "name": "Christopher C. Malabanan",
    "address": "Amare Homes",
    "block": "8",
    "lot": "2"
  },
  {
    "accountNo": "AM2017-0019RE",
    "name": "Richelle Enriquez",
    "address": "Amare Homes",
    "block": "9A",
    "lot": "15"
  },
  {
    "accountNo": "AM2018-0025RV",
    "name": "Reyna Virador",
    "address": "Amare Homes",
    "block": "9",
    "lot": "13"
  },
  {
    "accountNo": "AM2019-0026SS",
    "name": "Sheryl M. Sabran",
    "address": "Amare Homes",
    "block": "9A",
    "lot": "10"
  },
  {
    "accountNo": "AM2026-0110MV",
    "name": "Modesta C. Vertucio",
    "address": "Amare Homes",
    "block": "9A",
    "lot": "9"
  },
  {
    "accountNo": "AM2016-0089CS",
    "name": "Corazon V. Satira",
    "address": "Amare Homes",
    "block": "9",
    "lot": "8"
  },
  {
    "accountNo": "AM2019-0027AV",
    "name": "Arvin A. Vivas",
    "address": "Amare Homes",
    "block": "9",
    "lot": "7"
  },
  {
    "accountNo": "AM2024-0024MM",
    "name": "Manolo B. Morales",
    "address": "Amare Homes",
    "block": "8A",
    "lot": "7"
  },
  {
    "accountNo": "AM2025-0103MM",
    "name": "Manolo B. Morales 1",
    "address": "Amare Homes",
    "block": "8A",
    "lot": "7"
  },
  {
    "accountNo": "AM2025-0104MM",
    "name": "Manolo B. Morales 2",
    "address": "Amare Homes",
    "block": "8A",
    "lot": "7"
  },
  {
    "accountNo": "AM2025-0105MM",
    "name": "Manolo B. Morales 3",
    "address": "Amare Homes",
    "block": "8A",
    "lot": "7"
  },
  {
    "accountNo": "AM2015-0028YM",
    "name": "Yolanda Mirano",
    "address": "Amare Homes",
    "block": "9",
    "lot": "6"
  },
  {
    "accountNo": "AM2017-0030MM",
    "name": "Mel Malvar",
    "address": "Amare Homes",
    "block": "9A",
    "lot": "2"
  },
  {
    "accountNo": "AM2017-0031SV",
    "name": "Sharon S. Villanueva",
    "address": "Amare Homes",
    "block": "9A",
    "lot": "1"
  },
  {
    "accountNo": "AM2019-0032ZU",
    "name": "Zacarias Umandap",
    "address": "Amare Homes",
    "block": "9A",
    "lot": "21"
  },
  {
    "accountNo": "AM2018-0033AM",
    "name": "Ariel Manalang",
    "address": "Amare Homes",
    "block": "7A",
    "lot": "4"
  },
  {
    "accountNo": "AM2015-0034KC",
    "name": "Kemberly Joy Ann Cepe",
    "address": "Amare Homes",
    "block": "7",
    "lot": "1"
  },
  {
    "accountNo": "AM2024-0094LS",
    "name": "Liezel V. Sarmiento",
    "address": "Amare Homes",
    "block": "7",
    "lot": "3"
  },
  {
    "accountNo": "AM2024-0035RD",
    "name": "Rogelio G. De Castro",
    "address": "Amare Homes",
    "block": "7A",
    "lot": "2"
  },
  {
    "accountNo": "AM2016-0036CM",
    "name": "Catherine R. Malabuyoc",
    "address": "Amare Homes",
    "block": "6A",
    "lot": "8"
  },
  {
    "accountNo": "AM2016-0037AO",
    "name": "Abegael A. Ondo",
    "address": "Amare Homes",
    "block": "6A",
    "lot": "6"
  },
  {
    "accountNo": "AM2016-0038VA",
    "name": "Vencyn H. Ariola",
    "address": "Amare Homes",
    "block": "6a",
    "lot": "4"
  },
  {
    "accountNo": "AM2016-0039YS",
    "name": "Yolanda Saquilon",
    "address": "Amare Homes",
    "block": "6A",
    "lot": "1"
  },
  {
    "accountNo": "AM2016-0040MN",
    "name": "Michael A.Navarrete",
    "address": "Amare Homes",
    "block": "6A",
    "lot": "3"
  },
  {
    "accountNo": "AM2019-0041JF",
    "name": "Joel Falceso",
    "address": "Amare Homes",
    "block": "6A",
    "lot": "7"
  },
  {
    "accountNo": "AM2019-0042SS",
    "name": "Susan J. Suyat",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "12"
  },
  {
    "accountNo": "AM2021-0043RC",
    "name": "Rolly Credo Cañas",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "10"
  },
  {
    "accountNo": "AM2017-0044RA",
    "name": "Remar G. Araja",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "8"
  },
  {
    "accountNo": "AM2022-0045EB",
    "name": "Eloisa Fe C. Buño",
    "address": "Amare Homes",
    "block": "5",
    "lot": "2"
  },
  {
    "accountNo": "AM2025-0106RT",
    "name": "Rene N. Toledo",
    "address": "Amare Homes",
    "block": "5a",
    "lot": "4"
  },
  {
    "accountNo": "AM2017-0046DI",
    "name": "Divina Idio",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "3"
  },
  {
    "accountNo": "AM2019-0047LV",
    "name": "Luzviminda A. Velasquez",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "5"
  },
  {
    "accountNo": "AM2020-0048AH",
    "name": "Ann Loraine C. Hernandez",
    "address": "Amare Homes",
    "block": "5a",
    "lot": "7"
  },
  {
    "accountNo": "AM2017-0049MD",
    "name": "Myra Domingo",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "9"
  },
  {
    "accountNo": "AM2015-0050AN",
    "name": "Alvin Novela",
    "address": "Amare Homes",
    "block": "5A",
    "lot": "11"
  },
  {
    "accountNo": "AM2018-0051RM",
    "name": "Rachel Manalo",
    "address": "Amare Homes",
    "block": "4A",
    "lot": "12"
  },
  {
    "accountNo": "AM2018-0052RZ",
    "name": "Rogelio Zoleta",
    "address": "Amare Homes",
    "block": "4A",
    "lot": "10"
  },
  {
    "accountNo": "AM2017-0053FR",
    "name": "First Lerson Q. Regimen",
    "address": "Amare Homes",
    "block": "4A",
    "lot": "8"
  },
  {
    "accountNo": "AM2016-0054AP",
    "name": "Aquilino G. Pamplona, Jr.",
    "address": "Amare Homes",
    "block": "4A",
    "lot": "4"
  },
  {
    "accountNo": "AM2015-0055CC",
    "name": "Celeste Cajugao",
    "address": "Amare Homes",
    "block": "4A",
    "lot": "2"
  },
  {
    "accountNo": "AM2017-0056CV",
    "name": "Carlos E. Valle",
    "address": "Amare Homes",
    "block": "4A",
    "lot": "1"
  },
  {
    "accountNo": "AM2015-0057RA",
    "name": "Rose Jean Adolfo",
    "address": "Amare Homes",
    "block": "4",
    "lot": "3"
  },
  {
    "accountNo": "AM2016-0058DV",
    "name": "Dennis Dionne Villanueva",
    "address": "Amare Homes",
    "block": "4a",
    "lot": "5"
  },
  {
    "accountNo": "AM2022-0059JR",
    "name": "Jeffrey E. Roco",
    "address": "Amare Homes",
    "block": "4a",
    "lot": "7"
  },
  {
    "accountNo": "AM2025-0108MR",
    "name": "Maribel B. Rosales",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "10"
  },
  {
    "accountNo": "AM2016-0060EN",
    "name": "Edencio Nacino, jr",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "8"
  },
  {
    "accountNo": "AM2015-0061CC",
    "name": "Cristy G.Carandang",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "6"
  },
  {
    "accountNo": "AM2018-0062MM",
    "name": "Melody Maravive",
    "address": "Amare Homes",
    "block": "3a",
    "lot": "4"
  },
  {
    "accountNo": "AM2015-0063LC",
    "name": "Leonora Camitan",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "2"
  },
  {
    "accountNo": "AM2015-0064NC",
    "name": "Nilo de Castro",
    "address": "Amare Homes",
    "block": "3a",
    "lot": "1"
  },
  {
    "accountNo": "AM2015-0065RO",
    "name": "Ruel John Olivar",
    "address": "Amare Homes",
    "block": "3a",
    "lot": "3"
  },
  {
    "accountNo": "AM2018-0066PD",
    "name": "Phoebe Jane D. Duro",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "5"
  },
  {
    "accountNo": "AM2019-0067LP",
    "name": "Leila M. Perez",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "7"
  },
  {
    "accountNo": "AM2020-0068JM",
    "name": "Jose Memeo M. Matubis",
    "address": "Amare Homes",
    "block": "3A",
    "lot": "9"
  },
  {
    "accountNo": "AM2024-0070JM",
    "name": "John Michael O. Malabanan",
    "address": "Amare Homes",
    "block": "2a",
    "lot": "12"
  },
  {
    "accountNo": "AM2022-0071UB",
    "name": "Urik Baloran",
    "address": "Amare Homes",
    "block": "2A",
    "lot": "10"
  },
  {
    "accountNo": "AM2017-0072VC",
    "name": "Vanessa DC. Camon",
    "address": "Amare Homes",
    "block": "2a",
    "lot": "6"
  },
  {
    "accountNo": "AM2019-0073EA",
    "name": "Emanuel H. Alcazar",
    "address": "Amare Homes",
    "block": "2A",
    "lot": "4"
  },
  {
    "accountNo": "AM2026-0111AV",
    "name": "Arsenio V. Victoria",
    "address": "Amare Homes",
    "block": "2A",
    "lot": "2"
  },
  {
    "accountNo": "AM2021-0074ME",
    "name": "Ma. Teresa Evangelista",
    "address": "Amare Homes",
    "block": "2A",
    "lot": "1"
  },
  {
    "accountNo": "AM2019-0075MC",
    "name": "Miguel E. Cea Jr.",
    "address": "Amare Homes",
    "block": "2",
    "lot": "5"
  },
  {
    "accountNo": "AM2019-0076MM",
    "name": "Maria Glenna Mantala 2",
    "address": "Amare Homes",
    "block": "B2A",
    "lot": "7"
  },
  {
    "accountNo": "AM2015-0077RD",
    "name": "Redentor Datinguinoo",
    "address": "Amare Homes",
    "block": "2A",
    "lot": "9"
  },
  {
    "accountNo": "AM2017-0078GG",
    "name": "Govigis M. Gonzales",
    "address": "Amare Homes",
    "block": "2A",
    "lot": "11"
  },
  {
    "accountNo": "AM2019-0079IP",
    "name": "Imelda O. Prog",
    "address": "Amare Homes",
    "block": "B1A",
    "lot": "6"
  },
  {
    "accountNo": "AM2019-0080MM",
    "name": "Maria Glenna Mantala 1",
    "address": "Amare Homes",
    "block": "1",
    "lot": "5"
  },
  {
    "accountNo": "AM2017-0004JG",
    "name": "Jasmin A. Gamboa",
    "address": "Amare Homes",
    "block": "1A",
    "lot": "4"
  },
  {
    "accountNo": "AM2021-0081JB",
    "name": "Jennifer S. Balat",
    "address": "Amare Homes",
    "block": "1A",
    "lot": "2"
  },
  {
    "accountNo": "AM2016-0102DD",
    "name": "Danilo De Ocampo",
    "address": "Amare Homes",
    "block": "1",
    "lot": "1"
  },
  {
    "accountNo": "AM2024-0082MD",
    "name": "Mark Ryan V. Diaz",
    "address": "Amare Homes",
    "block": "1B",
    "lot": "1"
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
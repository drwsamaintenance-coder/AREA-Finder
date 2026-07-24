import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    query,
    limit 
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
// FIREBASE REAL TIME DATA (Optimized with Limit)
// ===============================

const residentsQuery = query(collection(db, "residents"), limit(50));

onSnapshot(residentsQuery, (snap) => {

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


    addressCount.innerText = 
        `Total Consumers: ${data.length}`;

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




// Search typing
searchInput.oninput = filterRecords;


// Address dropdown
addressFilter.onchange = filterRecords;




// ===============================
// CREATE / UPDATE RECORD
// ===============================

document.getElementById("addForm").onsubmit = async (e)=>{

    e.preventDefault();


    const data = {

        acc:
        document.getElementById("accNum").value,

        name:
        document.getElementById("fullName").value,

        address:
        document.getElementById("address").value,

        block:
        document.getElementById("block").value,

        lot:
        document.getElementById("lot").value

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
// EDIT
// ===============================

window.edit = (id)=>{

    const r = records.find(x=>x.id===id);


    editingId = id;


    document.getElementById("accNum").value = r.acc;
    document.getElementById("fullName").value = r.name;
    document.getElementById("address").value = r.address;
    document.getElementById("block").value = r.block;
    document.getElementById("lot").value = r.lot;


    modal.classList.add("active");

};




// ===============================
// DELETE
// ===============================

window.del = async(id)=>{

    if(confirm("Delete resident?")){

        await deleteDoc(
            doc(db,"residents",id)
        );

    }

};




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

    const current =
        addressFilter.value;


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



    // keep selected address
    if(uniqueAddresses.includes(current)){

        addressFilter.value = current;

    }

}
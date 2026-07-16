// ===============================
// Resident Records
// ===============================

const initialData = [
    {
        acc: "STM2018-0001RM",
        name: "Rose Ann Mariano",
        address: "St. Mathews",
        block: "3",
        lot: "2"
    },
    {
        acc: "STM2018-0002EE",
        name: "Evelyn Enriquez",
        address: "St. Mathews",
        block: "3",
        lot: "3"
    }
];

// Load records from localStorage
let records =
JSON.parse(localStorage.getItem("residentRecords"))
||
initialData;


// ===============================
// Render Table
// ===============================

function renderTable(data){

    const tableBody =
    document.getElementById("directoryTable");

    const noResults =
    document.getElementById("noResults");

    tableBody.innerHTML = "";

    if(data.length===0){

        noResults.style.display="block";

        return;

    }

    noResults.style.display="none";

    data.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

<td>

<span class="badge">

${item.acc}

</span>

</td>

<td>

${item.name}

</td>

<td>

${item.address}

</td>

<td>

Block ${item.block}

</td>

<td>

Lot ${item.lot}

</td>

<td>

<button
class="btn-edit"
onclick="editRecord('${item.acc}')"
>

Edit

</button>

<button
class="btn-delete"
onclick="deleteRecord('${item.acc}')"
>

Delete

</button>

</td>

`;

        tableBody.appendChild(row);

    });

}



// ===============================
// Address Filter
// ===============================

function loadAddressFilter(){

    const select =
    document.getElementById("addressFilter");

    select.innerHTML=
    `<option value="">All Addresses</option>`;

    const addresses=[

        ...new Set(
            records.map(
                r=>r.address
            )
        )

    ];

    addresses.forEach(address=>{

        const option=
        document.createElement("option");

        option.value=address;

        option.textContent=address;

        select.appendChild(option);

    });

}



function filterByAddress(){

    const address=

    document.getElementById(
        "addressFilter"
    ).value;

    if(address===""){

        renderTable(records);

        updateAddressCount(records);

        return;

    }

    const filtered=

    records.filter(

        item=>item.address===address

    );

    renderTable(filtered);

    updateAddressCount(filtered);

}
// ===============================
// Live Search
// ===============================

function filterDirectory(){

    const search=document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const filtered=records.filter(item=>{

        return(

            item.acc
            .toLowerCase()
            .includes(search)

            ||

            item.name
            .toLowerCase()
            .includes(search)

            ||

            item.address
            .toLowerCase()
            .includes(search)

            ||

            item.block
            .toLowerCase()
            .includes(search)

            ||

            item.lot
            .toLowerCase()
            .includes(search)

        );

    });

    renderTable(filtered);

}



// ===============================
// Modal
// ===============================

function toggleModal(show){

    const modal=
    document.getElementById("addModal");

    if(show){

        modal.classList.add("active");

    }

    else{

        modal.classList.remove("active");

        document
        .getElementById("addForm")
        .reset();

    }

}



// ===============================
// Edit Resident
// ===============================

let editingAcc=null;

function editRecord(acc){

    const resident=

    records.find(r=>r.acc===acc);

    if(!resident){

        alert("Resident not found.");

        return;

    }

    editingAcc=acc;

    document
    .getElementById("accNum")
    .value=resident.acc;

    document
    .getElementById("fullName")
    .value=resident.name;

    document
    .getElementById("address")
    .value=resident.address;

    document
    .getElementById("block")
    .value=resident.block;

    document
    .getElementById("lot")
    .value=resident.lot;

    toggleModal(true);

}



// ===============================
// Save Resident
// ===============================

function saveRecord(event){

    event.preventDefault();

    const resident={

        acc:
        document
        .getElementById("accNum")
        .value,

        name:
        document
        .getElementById("fullName")
        .value,

        address:
        document
        .getElementById("address")
        .value,

        block:
        document
        .getElementById("block")
        .value,

        lot:
        document
        .getElementById("lot")
        .value

    };

    if(editingAcc){

        const index=

        records.findIndex(

            r=>r.acc===editingAcc

        );

        records[index]=resident;

        editingAcc=null;

    }

    else{

        records.unshift(resident);

    }

    localStorage.setItem(

        "residentRecords",

        JSON.stringify(records)

    );

    renderTable(records);

    loadAddressFilter();

    updateAddressCount(records);

    toggleModal(false);

}
// ===============================
// Delete Resident
// ===============================

function deleteRecord(acc){

    if(!confirm("Delete this resident?")){

        return;

    }

    records = records.filter(

        resident => resident.acc !== acc

    );

    localStorage.setItem(

        "residentRecords",

        JSON.stringify(records)

    );

    renderTable(records);

    loadAddressFilter();

    updateAddressCount(records);

}



// ===============================
// Address Counter
// ===============================

function updateAddressCount(data){

    const countBox =

    document.getElementById(

        "addressCount"

    );

    if(countBox){

        countBox.innerHTML =

        "Total Consumers: " +

        data.length;

    }

}



// ===============================
// Initialize Website
// ===============================

loadAddressFilter();

renderTable(records);

updateAddressCount(records);



// ===============================
// Make functions available
// ===============================

window.editRecord = editRecord;

window.deleteRecord = deleteRecord;

window.saveRecord = saveRecord;

window.toggleModal = toggleModal;

window.filterDirectory = filterDirectory;

window.filterByAddress = filterByAddress;
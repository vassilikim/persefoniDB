import { showAlert } from "./alerts.js";

const theTable = document.getElementById("the_table");
theTable.style.display = "none";

const getData = async (genre, full_name) => {
  try {
    if (!genre) genre = "";
    if (!full_name) full_name = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/school-admin/average-rating-genres-users?genre=${genre}&full_name=${full_name}`,
    });

    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response.data)
    showAlert("error", err.response.data.message);
  }
};


const bodyTableList1 = document.getElementById("body_table1");
const none_table1 = document.getElementById("none_table1");
const bodyTableList2 = document.getElementById("body_table2");
const none_table2 = document.getElementById("none_table2");

function renderBodyTable(data, bool) {
  bodyTableList1.innerHTML = "";
  data.data1.forEach((Data) => {

    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");

    td1.textContent = Data.genre;
    td2.textContent = Data.avg_rating;

    tr.appendChild(td1);
    tr.appendChild(td2);
    bodyTableList1.appendChild(tr);
  });
  if (data.data2) {
    bodyTableList2.innerHTML = "";
    data.data2.forEach((Data) => {
  
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
  
      td1.textContent = Data.username;
      td2.textContent = Data.full_name;
      td3.textContent = Data.avg_rating;
  
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      bodyTableList2.appendChild(tr);
    });
    none_table2.style.display="block";
  } else {
    none_table2.style.display="none";
  }
  
  none_table1.style.display="block";
 
}


const loader = document.getElementById("loader_book");


loader.style.display = "block";
setTimeout(async () => {
    renderBodyTable(await getData(null, null));

  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const genre = document.getElementById("genre").value;
    const full_name = document.getElementById("full_name").value;

    if (genre && full_name) {
        renderBodyTable(await getData(genre, full_name), null);
    } else {
        renderBodyTable(await getData(genre, full_name), 1);
    }
    

    
  });

  loader.style.display = "none";
  theTable.style.display = "flex";
}, 1000);

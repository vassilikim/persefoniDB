import { showAlert } from "./alerts.js";

const getSchools = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/schools",
    });

    if (res.status == 200) {
      return res.data.schools;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const schoolList = document.getElementById('sch-card');

function renderSchools(schools) {
  schoolList.innerHTML = '';
  schools.forEach(school => {
    const schoolDiv = document.createElement('div');
    const buttonInfo = document.createElement('button');
    const title = document.createElement('h2');
    const address = document.createElement('h3');
    const city = document.createElement('h3');
    const phone = document.createElement('h3');
    const principal = document.createElement('h3');
    const email = document.createElement('h3');

    schoolDiv.className = 'schOfone';
    buttonInfo.className = 'sch-edit';
    buttonInfo.textContent= 'Edit';
    title.textContent = `${school.school_name}`;
    address.innerHTML = `<strong>Address: </strong>${school.address}`;
    city.innerHTML = `<strong>City: </strong>${school.city}`;
    phone.innerHTML = `<strong>Phone: </strong>${school.phone}`;
    email.innerHTML = `<strong>Email: </strong>${school.email}`;
    principal.innerHTML = `<strong>Principal: </strong>${school.principal}`;
    

    schoolDiv.appendChild(buttonInfo);
    schoolDiv.appendChild(title);
    schoolDiv.appendChild(address);
    schoolDiv.appendChild(city);
    schoolDiv.appendChild(phone);
    schoolDiv.appendChild(email);
    schoolDiv.appendChild(principal);
    schoolList.appendChild(schoolDiv);
  });
}

  renderSchools(await getSchools());


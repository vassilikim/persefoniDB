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

const signup = async (
  username,
  password,
  role,
  first_name,
  last_name,
  school,
  birth_date
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/library/auth/signup",
      data: {
        username,
        password,
        role,
        first_name,
        last_name,
        school,
        birth_date,
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const signupForm = document.getElementById("signup");

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  let school = document.getElementById("sch").value;
  const birth_date = document.getElementById("birth_date").value;

  if (school == "Please choose your school." && role != "super-admin") {
    showAlert("error", "Please provide all the required parameters.");
  } else {
    await signup(
      username,
      password,
      role,
      first_name,
      last_name,
      school,
      birth_date
    );
  }
});

const schoolList = document.getElementById("form-signup");
const myselect = document.createElement("select");
myselect.id = "sch";

function renderSchools(schools) {
  schoolList.innerHTML = "";
  const options = document.createElement("option");
  options.textContent = "Please choose your school.";
  options.value = "Please choose your school.";

  myselect.appendChild(options);
  schoolList.appendChild(myselect);

  schools.forEach((school) => {
    const options = document.createElement("option");

    options.textContent = school.school_name;
    options.value = school.school_name;

    myselect.appendChild(options);
    schoolList.appendChild(myselect);
  });
}

renderSchools(await getSchools());

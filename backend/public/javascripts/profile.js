document.addEventListener("DOMContentLoaded", function () {
  var link2 = document.querySelector(".school");
  const link = document.querySelector(".card-profile a.editprofile");
  const link1 = document.querySelector(".card-profile a.editpassword");
  const role = document.querySelector(".role");

  if (link2.textContent === "School: NULL") {
    link2.style.display = "none";
  } else {
    link2.classList.add("view-link");
  }

  if (role.textContent === "Role: teacher") {
    link.classList.add("view-link");
  } else {
    link1.classList.add("add-margin");
    link.style.display = "none";
  }
});

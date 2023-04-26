document.addEventListener("DOMContentLoaded", function() {
    const schoolName = document.querySelector(".card-profil  .school");
    const roleName = document.querySelector(".card-profil  .role");
    const link = document.querySelector(".card-profil #edit-profile");
    const link1 = document.querySelector(".card-profil a.editpassword");

    if (schoolName.textContent === "School: NULL") {
      schoolName.classList.add("hide-element");   
    }
    
    if (roleName.textContent === "Role: student"){
        link1.classList.add("add-margin");
        link.style.display = "none";
    }
  });
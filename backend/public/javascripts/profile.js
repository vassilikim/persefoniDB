const profileBtn = document.getElementById("profile-btn");

profileBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  
  location.assign("/profile");

});

document.addEventListener("DOMContentLoaded", function() {
    var link2 = document.querySelector(".card-profil  .school");
    // var link1 = document.querySelector(".card-profil a.editpassword");
    console.log(link2)

    
    if (link2.textContent === "School: NULL") {
      link2.classList.add("view-link");   

    } else {
    //   link1.classList.add("add-margin");
      link2.style.display = "none";
    }
});

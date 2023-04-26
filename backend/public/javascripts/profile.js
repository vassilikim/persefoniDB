const profileBtn = document.getElementById("profile-btn");

profileBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  location.assign("/profile");
});




const profileBtn = document.getElementById("profile-btn");

profileBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  location.assign("/profile");
});

const editBtn = document.getElementById("edit-profile");
if (editBtn) {
  editBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    location.assign("/edit-profile");
  });
}

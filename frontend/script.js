document.addEventListener("DOMContentLoaded", function() {
    var link = document.querySelector(".card-profil a.editprofil");
    var link1 = document.querySelector(".card-profil a.editpassword");
    var role = "admin";
    
    if (role === "admin") {
      link.classList.add("view-link");   

    } else {
      link1.classList.add("add-margin");
      link.style.display = "none";
    }
});


// Get the form element and add a submit event listener
var passwordForm = document.getElementById("password-form");

passwordForm.addEventListener("submit", function(event) {
    var mypassword="12345";
    // Get the current password, new password, and confirm password fields
    var currentPassword = document.getElementById("current-password");
    var newPassword = document.getElementById("new-password");
    var confirmPassword = document.getElementById("confirm-password");

    if (currentPassword.value!==mypassword){
        let error=document.getElementsByClassName("error")[0];
        error.classList.add("newerror");
        event.preventDefault();
        var errorMessage = document.getElementById("error-message");
        errorMessage.innerHTML = "Current password is incorrect";
        setTimeout(function() {
            error.classList.remove("newerror");
          }, 5000);
    }

    else if((newPassword.value).length<5){
        let error=document.getElementsByClassName("error")[0];
        error.classList.add("newerror");
        event.preventDefault();
        var errorMessage = document.getElementById("error-message");
        errorMessage.innerHTML = "The length of the new password must be more than 5 characters";
        setTimeout(function() {
            error.classList.remove("newerror");
          }, 5000);
    }

    else if (currentPassword.value===newPassword.value){
        let error=document.getElementsByClassName("error")[0];
        error.classList.add("newerror");
        event.preventDefault();
        var errorMessage = document.getElementById("error-message");
        errorMessage.innerHTML = "You must provide new password in this form";
        setTimeout(function() {
            error.classList.remove("newerror");
          }, 5000);
    }

    // Check if new password and confirm password match
    else if (newPassword.value !== confirmPassword.value) {
        let error=document.getElementsByClassName("error")[0];
        error.classList.add("newerror");
        // If they don't match, prevent the form from submitting and display an error message
        event.preventDefault();
        var errorMessage = document.getElementById("error-message");
        errorMessage.innerHTML = "New password and confirm password must match";
        setTimeout(function() {
            error.classList.remove("newerror");
          }, 5000);
    
    } 
        
    else {
        let error=document.getElementsByClassName("error")[0];
        error.classList.add("success_error");
        event.preventDefault();
        var errorMessage = document.getElementById("error-message");
        errorMessage.innerHTML = "You changed your password successfully";
        setTimeout(function() {
            error.classList.remove("success_error");
          }, 5000);
        // If they do match, allow the form to submit
        // (you would normally send the form data to the server here)
    }
});



// export const hideAlert = () => {
//   // If there is an alert element in the html code, erase it
//   const el = document.querySelector(".alert");
//   if (el) el.parentElement.removeChild(el);
// };

// export const showAlert = (type, msg, time = 7) => {
//   // Hide previouw alerts
//   hideAlert();
//   // Put the HTML code for the alert in the beginning of the body
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
//   if (type==='success'){
//     const button = document.getElementById('login-btn');
//     button.classList.add('loading');
//     button.disabled = true;
//   }
//   // Close the alert after five seconds
//   window.setTimeout(hideAlert, time * 1000);
// };

// // export const showAlert = (type, msg, time) => {
//   // Hide previous alerts
//   hideAlert();

//   // Put the HTML code for the alert in the beginning of the body
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

//   // Add loading state to button if alert type is success
//   if (type === 'success') {
//     const form = document.getElementById('login-btn');
//     form.classList.add('loading');
//     form.disabled = true;
//   }

//   // Close the alert after a specified time
//   window.setTimeout(() => {
//     hideAlert();

//     // Remove loading state from button if alert type is success
//     if (type === 'success') {
//       const form = document.getElementById('login-btn');
//       form.classList.remove('loading');
//       button.disabled = false;
//     }
//   }, time * 1000);
// };
export const hideAlert = () => {
  // If there is an alert element in the html code, erase it
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);

  // If the login button is disabled and has the loading class, remove it and enable it again
  const loginButton = document.getElementById("login-btn");
  if (loginButton && loginButton.disabled && loginButton.classList.contains("loading")) {
    loginButton.classList.remove("loading");
    loginButton.disabled = false;
  }

  const signupButton = document.getElementById("signup-btn");
  if (signupButton && signupButton.disabled && signupButton.classList.contains("loading")) {
    signupButton.classList.remove("loading");
    signupButton.disabled = false;
  }

  const changePasswordButton = document.getElementById("change-password-btn");
  if (changePasswordButton && changePasswordButton.disabled && changePasswordButton.classList.contains("loading")) {
    changePasswordButton.classList.remove("loading");
    changePasswordButton.disabled = false;
  }

  const editProfileBtn = document.getElementById("edit-btn");
  if (editProfileBtn && editProfileBtn.disabled && editProfileBtn.classList.contains("loading")) {
    editProfileBtn.classList.remove("loading");
    editProfileBtn.disabled = false;
  }

  const backupBtn = document.getElementById("backup");
  if (backupBtn && backupBtn.disabled && backupBtn.classList.contains("loading")) {
    backupBtn.classList.remove("loading");
    backupBtn.disabled = false;
  }

  const restoreBtn = document.getElementById("restore");
  if (restoreBtn && restoreBtn.disabled && restoreBtn.classList.contains("loading")) {
    restoreBtn.classList.remove("loading");
    restoreBtn.disabled = false;
  }
};

export const showAlert = (type, msg, time = 7) => {
  // Hide previous alerts
  hideAlert();
  
  // Put the HTML code for the alert in the beginning of the body
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  // If the type is success, show the loading spinner
  if (type === "success") {
    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
      loginButton.classList.add("loading");
      loginButton.disabled = true;
    }

    const signupButton = document.getElementById("signup-btn");
    if (signupButton) {
      signupButton.classList.add("loading");
      signupButton.disabled = true;
    }

    const changePasswordBtn = document.getElementById("change-password-btn");
    if (changePasswordBtn) {
      changePasswordBtn.classList.add("loading");
      changePasswordBtn.disabled = true;
    }

    const editProfileBtn = document.getElementById("edit-btn");
    if (editProfileBtn) {
      editProfileBtn.classList.add("loading");
      editProfileBtn.disabled = true;
    }

    const backupBtn = document.getElementById("backup");
    if (backupBtn) {
      backupBtn.classList.add("loading");
      backupBtn.disabled = true;
    }

    const restoreBtn = document.getElementById("restore");
    if (restoreBtn) {
      restoreBtn.classList.add("loading");
      restoreBtn.disabled = true;
    }
  }
  
  // Close the alert after a given time
  window.setTimeout(hideAlert, time * 1000);
};

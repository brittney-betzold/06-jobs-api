import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";
let loginRegisterDiv = null;
export const handleLoginRegister = () => {
  // Initialize login and register div
  loginRegisterDiv = document.getElementById("auth-section");

  // Get references to login and register buttons
  const loginButton = document.getElementById("login-button");
  const registerButton = document.getElementById("register-button");

  // Add click event listener to the auth section
  loginRegisterDiv.addEventListener("click", (e) => {
    // Check if input is enabled and the target is a button
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === loginButton) {
        // If login button is clicked, show login form
        showLogin();
      } else if (e.target === registerButton) {
        // If register button is clicked, show register form
        showRegister();
      }
    }
  });
};
export const showLoginRegister = () => {
  setDiv(loginRegisterDiv);
};

import {
  inputEnabled,
  setDiv,
  message,
  token,
  enableInput,
  setToken,
} from "./index.js";

import { showLoginRegister } from "./loginRegister.js";
import { showRecipes } from "./recipes.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
  // Initialize the register div and input fields
  registerDiv = document.getElementById("register-form");
  name = document.getElementById("register-name");
  email1 = document.getElementById("register-email");
  password1 = document.getElementById("register-password");
  password2 = document.getElementById("register-password2");
  // Get references to register and cancel buttons
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("cancel-recipe-button");

  // Add click event listener to the register form
  registerDiv.addEventListener("click", (e) => {
    // Check if input is enabled and the target is a button
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === registerButton) {
        // Handle registration logic here (e.g., sending a request to the server)

        // For now, let's just assume registration is successful
        // and show the recipes section
        showRecipes();
      } else if (e.target === registerCancel) {
        // If cancel button is clicked, show the login and register section
        showLoginRegister();
      }
    }
  });
};

export const showRegister = () => {
  // Reset the input fields
  name.value = "";
  email1.value = "";
  password1.value = "";
  password2.value = "";

  // Show the registration form
  setDiv(registerDiv);
};

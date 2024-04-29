import { setDiv, enableInput, setToken, token } from "./helpers.js";
import { showRecipes, handleRecipes } from "./recipes.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";
import { handleAddEdit } from "./addEdit.js";

// Initializing variables
let activeDiv = null;
export const setDiv = (newDiv) => {
  // Switch activeDiv
  if (newDiv !== activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

// State variable for input enabled/disabled
export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

// State variable for authentication token
export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

// Variable for displaying messages
export let message = null;

// Importing necessary modules and functions
import { showRecipes, handleRecipes } from "./recipes.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";
import { handleAddEdit } from "./addEdit.js";

// Initialization function
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the token from local storage
  token = localStorage.getItem("token");

  // Retrieve the message element for displaying user messages
  message = document.getElementById("message");

  // Initialize event handlers for different sections of the application
  handleLoginRegister();
  handleLogin();
  handleRegister();
  handleRecipes();
  handleAddEdit();

  // Decide which section to display based on the authentication token
  if (token) {
    showRecipes();
  } else {
    showLoginRegister();
  }
});

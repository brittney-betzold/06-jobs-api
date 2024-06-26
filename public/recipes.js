import {
  inputEnabled,
  setDiv,
  token,
  enableInput,
  setToken,
  message,
} from "./index.js";
import { showAddEdit, getToken } from "./addEdit.js";
import { showLoginRegister } from "./loginRegister.js";

let recipeDiv = null;
let recipeList = null;
let recipesTableHeader = null;
let isEditing = false;

export const handleRecipes = () => {
  recipeDiv = document.getElementById("recipes");
  recipeList = document.getElementById("recipe-body");
  recipesTableHeader = document.getElementById("recipes-header");
  const logoutButton = document.getElementById("logout-button");
  const createRecipeButton = document.getElementById("create-recipe-button");

  recipeDiv.addEventListener("click", async (e) => {
    // inputEnabled = false;
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === createRecipeButton) {
        showAddEdit();
      } else if (e.target.classList.contains("editButton")) {
        const recipeId = e.target.dataset.id;
        console.log("Dataset ID:", recipeId);
        isEditing = true;
        showAddEdit(recipeId);
      } else if (e.target.classList.contains("deleteButton")) {
        const recipeId = e.target.dataset.id;
        try {
          const response = await fetch(`/api/v1/recipes/${recipeId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          });
          // inputEnabled = true;
          if (response.ok) {
            const recipeRow = e.target.closest("tr");
            if (recipeRow) {
              recipeRow.remove();
              message.textContent = "Recipe deleted successfully.";
            } else {
              console.error("Error deleting recipe: Recipe row not found");
              message.textContent = "Error: Failed to delete recipe.";
            }
          } else {
            const data = await response.json();
            message.textContent = data.msg;
          }
        } catch (error) {
          console.error("Error deleting recipe:", error);
          message.textContent = "Error: Failed to delete recipe.";
        }
      } else if (e.target === logoutButton) {
        setToken(null);
        message.textContent = "You have been logged off.";
        recipeList.replaceChildren([recipesTableHeader]);
        showLoginRegister();
      }
    }
  });

  document.addEventListener("click", async (e) => {
    if (inputEnabled && isEditing && e.target.id === "saveButton") {
      console.log("Updating existing recipe...");
      isEditing = false;
    }
  });

  document.addEventListener("click", (e) => {
    if (inputEnabled && isEditing && e.target.id === "cancelButton") {
      console.log("Canceling edit...");
      isEditing = false;
    }
  });
};

export const showRecipes = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/recipes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [];

    if (response.status === 200) {
      if (data.count === 0) {
        recipeList.replaceChildren();
      } else {
        data.recipes.forEach((recipe) => {
          const rowEntry = document.createElement("tr");
          const nameCell = document.createElement("td");
          nameCell.textContent = recipe.recipeName || "Unknown recipe";
          rowEntry.appendChild(nameCell);

          const ingredientsList = recipe.ingredients
            .map((ingredient) => {
              const ingredientName =
                ingredient.ingredientName || "Unknown ingredient";
              const ingredientQuantity =
                ingredient.quantity || "Unknown quantity";
              return `${ingredientName}: ${ingredientQuantity}`;
            })
            .join(", ");

          const ingredientsCell = document.createElement("td");
          ingredientsCell.textContent = ingredientsList;
          rowEntry.appendChild(ingredientsCell);

          const cookingTimeCell = document.createElement("td");
          cookingTimeCell.textContent = recipe.cookingTime || "Unknown time";
          rowEntry.appendChild(cookingTimeCell);

          const servingSizeCell = document.createElement("td");
          servingSizeCell.textContent =
            recipe.servingSize || "Unknown serving size";
          rowEntry.appendChild(servingSizeCell);

          const categoryCell = document.createElement("td");
          categoryCell.textContent = recipe.category || "Unknown category";
          rowEntry.appendChild(categoryCell);

          const actionsCell = document.createElement("td");

          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.className = "editButton";
          editButton.dataset.id = recipe._id;
          editButton.textContent = "Edit";
          actionsCell.appendChild(editButton);
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.className = "deleteButton";
          deleteButton.dataset.id = recipe._id;
          deleteButton.textContent = "Delete";
          actionsCell.appendChild(deleteButton);
          rowEntry.appendChild(actionsCell);
          children.push(rowEntry);
        });
        recipeList.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(recipeDiv);
};

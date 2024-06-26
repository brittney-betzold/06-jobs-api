import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showRecipes } from "./recipes.js";

let addEditDiv = document.getElementById("add-edit-recipe");
let recipeName = document.getElementById("recipe-name");
let instructions = document.getElementById("instructions");
let cookingTime = document.getElementById("cooking-time");
let servingSize = document.getElementById("serving-size");
let category = document.getElementById("category");
let saveRecipe = document.getElementById("save-recipe");
let cancelRecipe = document.getElementById("cancel-recipe");
let addIngredientButton = document.getElementById("add-ingredient-button");
let ingredientFields = document.getElementById("ingredient-fields");

export const handleAddEdit = () => {
  addIngredientButton.addEventListener("click", () => {
    const newIngredientRow = document.createElement("div");
    newIngredientRow.className = "ingredient-row";

    const ingredientNameInput = document.createElement("input");
    ingredientNameInput.type = "text";
    ingredientNameInput.className = "ingredient-name";
    ingredientNameInput.placeholder = "Ingredient Name";
    ingredientNameInput.required = true;

    const ingredientQuantityInput = document.createElement("input");
    ingredientQuantityInput.type = "text";
    ingredientQuantityInput.className = "ingredient-quantity";
    ingredientQuantityInput.placeholder = "Quantity";
    ingredientQuantityInput.required = true;

    newIngredientRow.appendChild(ingredientNameInput);
    newIngredientRow.appendChild(ingredientQuantityInput);
    ingredientFields.appendChild(newIngredientRow);
  });

  saveRecipe.addEventListener("click", async () => {
    if (inputEnabled) {
      enableInput(false);

      const recipeData = gatherRecipeData();

      const url = addEditDiv.dataset.id
        ? `/api/v1/recipes/${addEditDiv.dataset.id}`
        : "/api/v1/recipes";
      const method = addEditDiv.dataset.id ? "PATCH" : "POST";

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(recipeData),
        });

        if (response.ok) {
          const data = await response.json();
          message.textContent = addEditDiv.dataset.id
            ? "The Recipe entry was updated."
            : "The Recipe entry was created.";
          clearForm();
          showRecipes();
        } else {
          const data = await response.json();
          message.textContent = data.msg;
        }
      } catch (error) {
        console.error("Error during request:", error);
        message.textContent = "A communication error occurred.";
      } finally {
        enableInput(true);
        setDiv(addEditDiv);
      }
    }
  });

  cancelRecipe.addEventListener("click", () => {
    clearForm();
    showRecipes();
    setDiv(addEditDiv);
  });
};

const gatherRecipeData = () => {
  const ingredients = [...document.querySelectorAll(".ingredient-row")].map(
    (row) => ({
      ingredientName: row.querySelector(".ingredient-name").value,
      quantity: row.querySelector(".ingredient-quantity").value,
    })
  );

  return {
    recipeName: recipeName.value,
    ingredients: ingredients,
    instructions: instructions.value,
    cookingTime: parseInt(cookingTime.value),
    servingSize: parseInt(servingSize.value),
    category: category.value,
  };
};

const clearForm = () => {
  recipeName.value = "";
  instructions.value = "";
  cookingTime.value = "";
  servingSize.value = "";
  category.value = "";
  ingredientFields.innerHTML = "";

  const defaultIngredientRow = document.createElement("div");
  defaultIngredientRow.className = "ingredient-row";
  defaultIngredientRow.innerHTML = `<input type="text" class="ingredient-name" placeholder="Ingredient Name" required>
    <input type="text" class="ingredient-quantity" placeholder="Quantity" required>`;
  ingredientFields.appendChild(defaultIngredientRow);
};

const populateForm = (recipe) => {
  recipeName.value = recipe.recipeName || "";
  instructions.value = recipe.instructions || "";
  cookingTime.value = recipe.cookingTime || "";
  servingSize.value = recipe.servingSize || "";
  category.value = recipe.category || "";

  ingredientFields.innerHTML = "";
  recipe.ingredients.forEach((ing) => {
    const newIngredientRow = document.createElement("div");
    newIngredientRow.className = "ingredient-row";

    newIngredientRow.innerHTML = `<input type="text" class="ingredient-name" value="${
      ing.ingredientName || ""
    }" required>
    <input type="text" class="ingredient-quantity" value="${
      ing.quantity || ""
    }" required>`;

    ingredientFields.appendChild(newIngredientRow);
  });
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const showAddEdit = async (recipeId) => {
  const authToken = getToken();

  try {
    if (!recipeId) {
      clearForm();
      addEditDiv.removeAttribute("data-id");
    } else {
      const response = await fetch(`/api/v1/recipes/${recipeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }

      const data = await response.json();
      const recipe = data.recipe;
      populateForm(recipe);
      addEditDiv.dataset.id = recipeId;
      recipeName.value = recipe.recipeName || "";
      instructions.value = recipe.instructions || "";
      cookingTime.value = recipe.cookingTime || "";
      servingSize.value = recipe.servingSize || "";
      category.value = recipe.category || "";

      if (recipe.ingredients) {
        ingredientFields.innerHTML = "";
        recipe.ingredients.forEach((ing, index) => {
          const newIngredientRow = document.createElement("div");
          newIngredientRow.className = "ingredient-row";

          const ingredientNameInput = document.createElement("input");
          ingredientNameInput.type = "text";
          ingredientNameInput.className = "ingredient-name";
          ingredientNameInput.value = ing.ingredientName || "";
          ingredientNameInput.required = true;

          const ingredientQuantityInput = document.createElement("input");
          ingredientQuantityInput.type = "text";
          ingredientQuantityInput.className = "ingredient-quantity";
          ingredientQuantityInput.value = ing.quantity || "";
          ingredientQuantityInput.required = true;

          newIngredientRow.appendChild(ingredientNameInput);
          newIngredientRow.appendChild(ingredientQuantityInput);
          ingredientFields.appendChild(newIngredientRow);
        });
      }
    }

    setDiv(addEditDiv);
  } catch (error) {
    console.error(error);
    message.textContent = "Error: Failed to fetch recipe details";
  }
};

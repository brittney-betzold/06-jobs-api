const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllRecipes = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is available in req.user after authentication
    let query = { createdBy: userId };

    // Check if search query is provided
    const { search } = req.query;
    if (search) {
      query.recipeName = { $regex: search, $options: "i" }; // Case-insensitive search for recipeName
    }

    const recipes = await Recipe.find(query).sort("createdAt");
    res.status(StatusCodes.OK).json({ recipes, count: recipes.length });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error" });
  }
};

const getSingleRecipe = async (req, res) => {
  const {
    user: { userId },
    params: { id: recipeId },
  } = req;
  const recipe = await Recipe.findOne({
    _id: recipeId,
    createdBy: userId,
  });
  if (!recipe) {
    throw new NotFoundError(`No recipe with this id ${recipeId}`);
  }
  res.status(StatusCodes.OK).json({ recipe });
};

const createRecipe = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const recipe = await Recipe.create(req.body);
  res.status(StatusCodes.CREATED).json({ recipe });
};

const updateRecipe = async (req, res) => {
  try {
    const {
      body: {
        recipeName,
        instructions,
        ingredients,
        cookingTime,
        servingSize,
        category,
      },
      user: { userId },
      params: { id: recipeId },
    } = req;

    // Check if required fields are provided
    if (
      !recipeName ||
      !instructions ||
      !cookingTime ||
      !servingSize ||
      !category
    ) {
      throw new BadRequestError("All required fields must be filled");
    }

    // Validate ingredients

    if (!ingredients?.length) {
      throw new BadRequestError("Ingredients cannot be empty");
    }
    for (const ingredient of ingredients) {
      if (!ingredient.ingredientName || !ingredient.quantity) {
        throw new BadRequestError(
          "Each ingredient must have a name and quantity"
        );
      }
    }

    // Update the recipe in the database
    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    // Check if the recipe was found
    if (!recipe) {
      throw new NotFoundError(`No recipe found with ID: ${recipeId}`);
    }
    res.status(StatusCodes.OK).json({ recipe });
  } catch (error) {
    // Handle errors
    if (error instanceof BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      // Handle other unexpected errors
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "An unexpected error occurred",
      });
    }
  }
};

const deleteRecipe = async (req, res) => {
  const {
    user: { userId },
    params: { id: recipeId },
  } = req;
  if (!mongoose.isValidObjectId(recipeId)) {
    throw new NotFoundError(`No recipe found with ID: ${recipeId}`);
  }
  const recipe = await Recipe.findByIdAndRemove({
    _id: recipeId,
    createdBy: userId,
  });
  if (!recipe) {
    throw new NotFoundError(`No recipe found with ID: ${recipeId}`);
  }
  res.status(StatusCodes.OK).send(`Sucessfully deleted ${recipe.recipeName}`);
};
// recipes.js

// Import necessary variables and functions if needed

// Define the searchRecipes function
const searchRecipes = async (searchQuery) => {
  try {
    const response = await fetch(
      `/api/v1/recipes?search=${encodeURIComponent(searchQuery)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      // Update the recipe list with search results
      let children = [];
      data.recipes.forEach((recipe) => {
        // Create rows for each recipe found in search
        const rowEntry = document.createElement("tr");
        // Populate row cells with recipe details (similar to showRecipes function)
        // ...
        children.push(rowEntry);
      });
      recipeList.replaceChildren(...children);
      message.textContent = `${data.recipes.length} recipes found.`;
    } else {
      message.textContent = data.msg;
    }
  } catch (error) {
    console.error("Error searching recipes:", error);
    message.textContent = "Error: Failed to search recipes.";
  }
};

// Ensure the function is exported if needed

module.exports = {
  getAllRecipes,
  getSingleRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
};

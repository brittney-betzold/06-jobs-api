const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ recipes, count: recipes.length });
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

module.exports = {
  getAllRecipes,
  getSingleRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};

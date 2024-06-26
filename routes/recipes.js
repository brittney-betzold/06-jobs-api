const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getSingleRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipes");

// Route for creating a new recipe
router.route("/").post(createRecipe);

// Route for getting all recipes with optional search query
router.get("/", getAllRecipes);

// Route for getting a single recipe, updating, or deleting it
router
  .route("/:id")
  .get(getSingleRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

module.exports = router;

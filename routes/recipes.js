const express = require("express");
const router = express.Router();

const {
  getAllRecipes,
  getSingleRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipes");

router.route("/").post(createRecipe).get(getAllRecipes);

router
  .route("/:id")
  .get(getSingleRecipe)
  .delete(deleteRecipe)
  .patch(updateRecipe);

module.exports = router;

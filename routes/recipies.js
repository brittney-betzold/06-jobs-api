const express = require("express");
const router = express.Router();

const {
  getAllRecipies,
  getSingleRecipie,
  createRecipie,
  updateRecipie,
  deleteRecipie,
} = require("../controllers/recipies");

router.route("/").post(createRecipie).get(getAllRecipies);

router
  .route("/:id")
  .get(getSingleRecipie)
  .delete(deleteRecipie)
  .patch(updateRecipie);

module.exports = router;

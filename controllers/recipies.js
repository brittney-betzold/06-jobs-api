const Recipie = require("../models/Recipie");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllRecipies = async (req, res) => {
  res.send("GET all Recipies ");
};
const getSingleRecipie = async (req, res) => {
  res.send("Get single recipie");
};
const createRecipie = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const recipie = await Recipie.create(req.body);
  res.status(StatusCodes.CREATED).json({ recipie });
};
const updateRecipie = async (req, res) => {
  res.send("Update Recipie");
};
const deleteRecipie = async (req, res) => {
  res.send("Delete Recipie");
};

module.exports = {
  getAllRecipies,
  getSingleRecipie,
  createRecipie,
  updateRecipie,
  deleteRecipie,
};

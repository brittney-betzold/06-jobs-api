const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid Error");
  }

  try {
    const token = authHeader?.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT payload:", req.user);

    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    throw new UnauthenticatedError("Invalid Auth Token");
  }
};
module.exports = auth;

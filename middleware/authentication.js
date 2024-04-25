const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Missing or invalid authorization header");
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT payload:", payload);

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
module.exports = auth;

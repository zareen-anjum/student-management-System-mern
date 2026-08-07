const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// Protects routes by verifying the JWT sent in the Authorization header
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Not authorized, no token provided");
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the authenticated user to the request (excluding password)
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Not authorized, user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Not authorized, invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Not authorized, token expired"));
    }
    next(error);
  }
};

module.exports = { protect };

const mongoose = require("mongoose");

// Establishes connection to MongoDB using the URI from environment variables.
// Works with both a local MongoDB instance and a MongoDB Atlas (cloud) cluster -
// the connection string format (mongodb:// vs mongodb+srv://) determines which one is used.
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "MongoDB Connection Error: MONGO_URI is not set. Copy server/.env.example to server/.env and set it."
    );
    process.exit(1);
  }

  // Catch the common mistake of leaving the Atlas placeholder credentials in place
  if (uri.includes("<username>") || uri.includes("<password>")) {
    console.error(
      "MongoDB Connection Error: MONGO_URI still contains placeholder <username>/<password>. " +
        "Replace them with your real MongoDB Atlas database user credentials in server/.env."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    const isAtlas = uri.startsWith("mongodb+srv://");
    console.log(
      `MongoDB Connected (${isAtlas ? "Atlas cloud" : "local"}): ${conn.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (uri.startsWith("mongodb+srv://")) {
      console.error(
        "Tip: if using MongoDB Atlas, double-check your database user password and that your " +
          "current IP is whitelisted under Network Access in the Atlas dashboard."
      );
    }
    // Exit process with failure if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;

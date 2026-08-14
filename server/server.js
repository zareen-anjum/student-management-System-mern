require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route imports
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ---------- CORS ----------

const allowedOrigins = [
  "http://localhost:3000",

  // Frontend Vercel URL
  "https://student-management-system-mern-25hf-h60jobhdd.vercel.app",

  // Optional environment variable
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      // Allow approved frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

// ---------- Global Middleware ----------

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ---------- API Routes ----------

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// Authentication
app.use("/api/auth", authRoutes);

// Students
app.use("/api/students", studentRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ---------- Error Handling ----------

app.use(notFound);
app.use(errorHandler);

// ---------- Server ----------

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
  });
}

// ---------- Export for Vercel ----------

module.exports = app;

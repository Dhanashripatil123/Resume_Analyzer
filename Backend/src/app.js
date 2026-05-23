const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const cors = require('cors');

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://resume-analyzer-frontend-itr2.onrender.com",
  "http://localhost:5173",
];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
};
app.use(cors(corsOptions));

// require all the route here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.route")

// using all the routes
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
app.set("trust proxy", 1);

module.exports = app
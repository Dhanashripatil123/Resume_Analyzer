const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const cors = require('cors');

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [[process.env.FRONTEND_URL || "https://resume-analyzer-frontend-itr2.onrender.com"]];
const corsOptions = {
  origin: function (origin, callback) {
          // allow requests with no origin like mobile apps or curl
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) !== -1) {
               return callback(null, true);
          }
          return callback(new Error("CORS policy: Origin not allowed"));
     },
     credentials: true,
};
app.use(cors(corsOptions));

// require all the route here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.route")

// using all the routes
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

module.exports = app
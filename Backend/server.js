const app = require("./src/app");
require("dotenv").config();

const connectTOB = require("./src/config/databse");

// Connect Database
connectTOB();

// Start Server
app.listen(3000, () => {
   console.log("server is running port 3000");
});
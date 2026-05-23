const app = require("./src/app");
require("dotenv").config();

const connectTOB = require("./src/config/databse");

// Connect Database
connectTOB();

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
//express initialization
const express = require("express");
const env = require("dotenv");
const app = express();
const cors = require("cors");

// express route initialization from routes/routes.js
const route = require("./routes/routes.js");

// app configuration
app.use(express.json());
app.use(cors());
app.use(cors({ credentials: true }));
app.use(route);
env.config();

const PORT = process.env.PORT || 2000;

//listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const env = require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// const corsOptions = {
//   origin: [],
//   optionsSuccessStatus: 200,
// };

app.use("/images", express.static("images"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", require("./controller"));

const PORT = process.env.PORT || 1150;
app.listen(PORT, () => {
  const env = `${process.env.NODE_ENV || "development"}`;
  console.log(`App listening on port ${PORT}`);
  console.log(`App listening on env ${env}`);
  console.log("Press Ctrl+C to quit.");
});

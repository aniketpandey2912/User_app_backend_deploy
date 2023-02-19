require("dotenv").config();
const express = require("express");
const { connection } = require("./configs/db");
const app = express();
app.use(express.json());
const { usersRouter } = require("./routes/Users.routes");

app.get("/", (req, res) => {
  res.send("WELCOME");
});

app.use("/users", usersRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log("Can't connect to mongoDB");
  }

  console.log("Server running at " + process.env.PORT);
});

// {
//   "username": "Aniket Pandey",
//   "email": "aniket@gmail.com",
//   "DOB": "29-12-1997",
//   "Role": "Explorer",
//   "location": "Lucknow",
//   "password": "aniket",
//   "confirm_password": "aniket"
// }

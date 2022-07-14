const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// init mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .catch((error) => console.log(`DB Connection error: ${error}`));
const con = mongoose.connection;

con.on("open", (error) => {
  if (!error) {
    console.log("DB connection successful");
  } else {
    console.log(`DB connection failed with error: ${error}`);
  }
});

con.on("disconnected", (error) => {
  console.log(`Mongoose lost connection to DB: ${error}`);
});

app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", require("./routes/auth"));
app.use("/todo", require("./routes/todo"));
app.use("/search", require("./routes/search"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

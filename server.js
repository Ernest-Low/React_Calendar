require("dotenv").config();
const express = require("express");

const calendarController = require("./controllers/calendarController");

//configuration
const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.static("./client/dist/"));

// //middleware
// // app.use(cors());
// app.use(cors(corsOptions));
app.use(express.json());

console.log("Server running");

app.use("/api", calendarController);

app.listen(PORT, () => {
  console.log(`Express listing on ${PORT}`);
});

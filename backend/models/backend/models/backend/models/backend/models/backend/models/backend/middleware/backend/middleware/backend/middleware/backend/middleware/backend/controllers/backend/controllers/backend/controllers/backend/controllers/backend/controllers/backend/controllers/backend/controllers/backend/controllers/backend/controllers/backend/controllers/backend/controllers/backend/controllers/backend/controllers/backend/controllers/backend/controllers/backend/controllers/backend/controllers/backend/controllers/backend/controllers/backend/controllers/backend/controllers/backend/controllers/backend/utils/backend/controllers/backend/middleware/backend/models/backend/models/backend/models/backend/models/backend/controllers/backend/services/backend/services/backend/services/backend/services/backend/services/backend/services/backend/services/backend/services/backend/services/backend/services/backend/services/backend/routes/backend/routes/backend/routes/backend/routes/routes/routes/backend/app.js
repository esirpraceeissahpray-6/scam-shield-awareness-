const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const cJ = require("./r/cJ");
const cL = require("./r/cL");
const cP = require("./r/cP");

app.use("/api/c/j", cJ);
app.use("/api/c/l", cL);
app.use("/api/c/p", cP);

app.get("/", (req, res) => {
  res.send("ScamShield AI API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

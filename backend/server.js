const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const connectDatabase = require("./config/database");
const reportRoutes = require("./routes/reportRoutes");
const rateLimiter = require("./middleware/middlewares/rateLimiter");
const limitMiddleware = require("./middleware/Limit");

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(limitMiddleware);

connectDatabase();

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Scam Shield Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

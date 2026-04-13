const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/device.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/devices", deviceRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/device.routes");
const workRoutes = require("./routes/work.routes");

const app = express();

// 🔥 CORS FIX CHẮC CHẮN
app.use(cors({
  origin: "*", // 👉 test trước
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use("/api/devices", deviceRoutes);
app.use("/api/work-orders", workRoutes);

app.listen(5000, () => {
  console.log("Server running");
});

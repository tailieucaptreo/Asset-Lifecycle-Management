const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/device.routes");

const app = express();

const workRoutes = require("./routes/work.routes");

app.use("/api/work-orders", workRoutes);

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://asset-lifecycle-management.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// 👇 quan trọng
app.use("/api/devices", deviceRoutes);

app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});

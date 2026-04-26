const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/device.routes");
const workRoutes = require("./routes/work.routes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://asset-lifecycle-management.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/devices", deviceRoutes);
app.use("/api/work-orders", workRoutes);

app.get("/", (req, res) => {
  res.send("API RUNNING...");
});

app.listen(5000, () => {
  console.log("Server chạy tại port 5000");
});

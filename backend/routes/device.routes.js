const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

// ✅ TEST ROUTE
router.get("/", async (req, res) => {
  const data = await prisma.device.findMany();
  res.json(data);
});

// 🔥 CREATE (FIX CỨNG)
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const device = await prisma.device.create({
      data: {
        name: req.body.name,
        line: req.body.line,
        station: req.body.station,
        code: req.body.code || null,
        area: req.body.area || null,
        deviceId: req.body.deviceId || null,
        status: req.body.status,
        lifespan: req.body.lifespan || null,
        installDate: req.body.installDate || null,
        lastMaintenance: req.body.lastMaintenance || null,
        expiryDate: req.body.expiryDate || null
      }
    });

    res.json(device);
  } catch (err) {
    console.log("🔥 LỖI THẬT:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
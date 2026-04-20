const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const {
  getDevices,
  importExcel,
  exportExcel
} = require("../controllers/device.controller");

// GET
router.get("/", getDevices);

// CREATE
router.post("/", async (req, res) => {
  try {
    const device = await prisma.device.create({
      data: req.body
    });

    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// IMPORT
router.post("/import", upload.single("file"), importExcel);

// EXPORT
router.get("/export", exportExcel);

module.exports = router;
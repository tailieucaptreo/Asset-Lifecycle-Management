const express = require("express");
const router = express.Router();

const {
  getDevices,
  importExcel
} = require("../controllers/device.controller");

router.get("/", getDevices);
router.post("/import", importExcel);

module.exports = router;
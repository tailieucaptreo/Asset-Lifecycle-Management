const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/device.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controller.getDevices);
router.post("/", controller.createDevice);
router.delete("/:id", controller.deleteDevice);

router.post("/import", upload.single("file"), controller.importExcel);

module.exports = router;

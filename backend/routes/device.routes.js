const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/device.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controller.getDevices);
router.post("/", controller.createDevice);
router.put("/:id", controller.updateDevice);   // 👈 BẮT BUỘC PHẢI CÓ
router.delete("/:id", controller.deleteDevice);
router.post("/import", upload.single("file"), controller.importExcel);
router.put("/:id", controller.updateDevice);

module.exports = router;

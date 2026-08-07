const express = require("express");

const router = express.Router();

const backupController = require("../controllers/backup.controller");

// =======================================
// Backup toàn bộ hệ thống
// GET /api/backup/system
// =======================================

router.get(
    "/system",
    backupController.backupSystem
);

module.exports = router;

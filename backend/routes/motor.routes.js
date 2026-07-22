const express = require("express");
const multer = require("multer");

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const controller = require("../controllers/motor.controller");

const router = express.Router();

/* =====================================================
   Multer (Memory Storage)
===================================================== */

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {

        fileSize: 20 * 1024 * 1024

    }

});

/* =====================================================
   Statistics
===================================================== */

router.get(
    "/statistics",
    auth,
    controller.getStatistics
);

/* =====================================================
   History
===================================================== */

router.get(
    "/history",
    auth,
    controller.getHistory
);

/* =====================================================
   Export
===================================================== */

router.get(
    "/export",
    auth,
    controller.exportExcel
);

router.get(
    "/template",
    auth,
    controller.exportTemplate
);

/* =====================================================
   Import
===================================================== */

router.post(

    "/preview-import",

    auth,

    role("admin"),

    upload.single("file"),

    controller.previewImport

);

router.post(

    "/import",

    auth,

    role("admin"),

    upload.single("file"),

    controller.importMotors

);

/* =====================================================
   CRUD
===================================================== */

router.get(
    "/",
    auth,
    controller.getMotors
);

router.get(
    "/:id",
    auth,
    controller.getMotor
);

router.post(
    "/",
    auth,
    role("admin"),
    controller.createMotor
);

router.put(
    "/:id",
    auth,
    role("admin"),
    controller.updateMotor
);

router.delete(
    "/:id",
    auth,
    role("admin"),
    controller.deleteMotor
);

module.exports = router;

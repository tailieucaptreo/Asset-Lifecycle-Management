const router = require("express").Router();

const controller =
    require("../controllers/drive.controller");

const upload =
    require("../middleware/upload");

const auth =
    require("../middleware/auth");

const role =
    require("../middleware/role");

// ================= IMPORT =================

router.post(
    "/preview-import",
    upload.single("file"),
    controller.previewImport
);

router.post(
    "/confirm-import",
    controller.confirmImport
);

// ================= IMAGE =================

router.post(
    "/upload",
    upload.single("image"),
    controller.uploadImage
);

// ================= EXPORT =================

router.get(
    "/export",
    controller.exportExcel
);

// ================= STATISTICS =================

router.get(
    "/statistics",
    controller.getStatistics
);

// ================= FAULT HISTORY =================

router.get(
    "/:id/faults",
    controller.getFaults
);

router.post(
    "/:id/faults",
    auth,
    role("admin", "user"),
    controller.addFault
);

router.put(
    "/fault/:id",
    auth,
    role("admin", "user"),
    controller.updateFault
);

router.delete(
    "/fault/:id",
    auth,
    role("admin"),
    controller.deleteFault
);

// ================= CRUD =================

router.get(
    "/",
    controller.getAll
);

router.get(
    "/:id",
    controller.getOne
);

router.post(
    "/",
    auth,
    role("admin"),
    controller.create
);

router.put(
    "/:id",
    auth,
    role("admin"),
    controller.update
);

router.delete(
    "/:id",
    auth,
    role("admin"),
    controller.remove
);

module.exports = router;

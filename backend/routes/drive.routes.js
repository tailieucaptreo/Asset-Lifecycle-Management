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
    auth,
    role("admin"),
    upload.single("file"),
    controller.previewImport
);

router.post(
    "/import",
    auth,
    role("admin"),
    controller.importExcel
);

// ================= IMAGE =================

router.post(
    "/upload",
    upload.single("image"),
    controller.uploadImage
);

// ================= FILTER =================

router.get(
    "/filters",
    auth,
    controller.getFilters
);

// ================= EXPORT =================

router.get(
    "/export",
    auth,
    role("admin", "user"),
    controller.exportExcel
);

// ================= STATISTICS =================

router.get(
    "/statistics",
    auth,
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
    auth,
    controller.getAll
);

router.get(
    "/:id",
    auth,
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

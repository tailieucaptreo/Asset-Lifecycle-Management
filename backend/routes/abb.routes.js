const router = require("express").Router();

const controller =
    require("../controllers/abb.controller");

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
    auth,
    role("admin"),
    controller.confirmImport
);

// ================= EXPORT =================

router.get(
    "/export",
    controller.exportExcel
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

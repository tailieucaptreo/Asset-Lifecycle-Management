const router = require("express").Router();

const controller =
require("../controllers/spare.controller");

const upload =
require("../middleware/upload");

const auth =
require("../middleware/auth");

const role =
require("../middleware/role");

// IMPORT
router.post(
"/preview-import",
upload.single("file"),
controller.previewImport
);

router.post(
"/confirm-import",
controller.confirmImport
);

// IMAGE
router.post(
"/upload",
upload.single("image"),
controller.uploadImage
);

// EXPORT
router.get(
"/export",
controller.exportExcel
);

// HISTORY
router.get(
"/history",
controller.getHistory
);

// CRUD
router.get(
"/",
controller.getAll
);

// ĐỔI create
router.post(
"/",
auth,
role("admin"),
controller.create
);

router.put(
"/:id",
auth,
role("admin","user"),
controller.update
);

router.delete(
"/:id",
auth,
role("admin"),
controller.remove
);

router.get(
"/:id",
controller.getOne
);

module.exports =
router;

const router = require("express").Router();

const controller =
  require("../controllers/spare.controller");

const upload =
  require("../middleware/upload");

// ================= PREVIEW IMPORT =================
router.post(
  "/preview-import",
  upload.single("file"),
  controller.previewImport
);

// ================= CONFIRM IMPORT =================
router.post(
  "/confirm-import",
  controller.confirmImport
);

// ================= UPLOAD IMAGE =================
router.post(
  "/upload",
  upload.single("image"),
  controller.uploadImage
);

// ================= EXPORT EXCEL =================
router.get(
  "/export",
  controller.exportExcel
);

// ================= HISTORY =================
router.get(
  "/history",
  controller.getHistory
);

// ================= CRUD =================
router.get("/", controller.getAll);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

router.get("/export", controller.exportExcel);

// LUÔN ĐẶT CUỐI CÙNG
router.get("/:id", controller.getOne);

module.exports = router;

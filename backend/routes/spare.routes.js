const router = require("express").Router();

const controller =
  require("../controllers/spare.controller");

const upload =
  require("../middleware/upload");

const auth = require("../middleware/auth");

const role = require("../middleware/role");

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

router.post("/create", auth, role("admin"), controller.create);

router.put("/:id", auth, role("admin","user"), controller.update);

router.delete("/:id", auth, role("admin"), controller.remove);

router.get("/export", controller.exportExcel);

// LUÔN ĐẶT CUỐI CÙNG
router.get("/:id", controller.getOne);

module.exports = router;

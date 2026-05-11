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

// ================= CRUD =================
router.get("/", controller.getAll);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

// LUÔN ĐẶT CUỐI CÙNG
router.get("/:id", controller.getOne);

module.exports = router;

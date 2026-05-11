const router = require("express").Router();

const controller =
  require("../controllers/spare.controller");

const upload =
  require("../middleware/upload");

// ================= IMPORT EXCEL =================
router.post(
  "/import",
  upload.single("file"),
  controller.importExcel
);

// ================= UPLOAD IMAGE =================
router.post(
  "/upload",
  upload.single("image"),
  controller.uploadImage
);

// ================= CRUD =================
router.get("/", controller.getAll);

router.get("/:id", controller.getOne);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

module.exports = router;

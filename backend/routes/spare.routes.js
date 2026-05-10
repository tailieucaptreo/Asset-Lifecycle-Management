const router = require("express").Router();

const controller = require("../controllers/spare.controller");

const upload = require("../middleware/upload");

// ================= CRUD =================
router.get("/", controller.getAll);

router.get("/:id", controller.getOne);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

// ================= UPLOAD IMAGE =================
router.post(
  "/upload",
  upload.single("image"),
  controller.uploadImage
);

module.exports = router;

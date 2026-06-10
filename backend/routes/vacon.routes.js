const express = require("express");
const router = express.Router();

const vaconController =
  require("../controllers/vacon.controller");

const auth =
  require("../middleware/auth");


// Danh sách
router.get(
  "/",
  auth,
  vaconController.getAll
);

// Chi tiết
router.get(
  "/:id",
  auth,
  vaconController.getOne
);

// Thêm mới
router.post(
  "/",
  auth,
  vaconController.create
);

// Cập nhật
router.put(
  "/:id",
  auth,
  vaconController.update
);

// Xóa
router.delete(
  "/:id",
  auth,
  vaconController.remove
);

module.exports = router;

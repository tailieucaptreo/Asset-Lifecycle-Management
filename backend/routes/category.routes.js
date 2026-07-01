const router = require("express").Router();
const controller =
require("../controllers/category.controller");

router.get("/", controller.getAll);
router.post("/", controller.create);

module.exports = router;

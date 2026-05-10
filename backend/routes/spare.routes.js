const router = require("express").Router();

const controller = require("../controllers/spare.controller");

router.get("/", controller.getAll);

module.exports = router;

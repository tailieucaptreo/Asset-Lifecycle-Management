const router = require("express").Router();

const controller =
    require("../controllers/drive.controller");

const auth =
    require("../middleware/auth");

const role =
    require("../middleware/role");

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

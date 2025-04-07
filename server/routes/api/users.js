const { Router } = require("express");
const router = Router();
const usersController = require("../../controllers/usersController");

router.get("/:id", usersController.getUser);
router.put("/:id", usersController.updateUserEmail);
router.post("/:id", usersController.insertUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;

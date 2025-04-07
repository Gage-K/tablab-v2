const { Router } = require("express");
const router = Router();
const tabsController = require("../../controllers/tabsController");

router.get("/", tabsController.getAllTabs);
router.post("/", tabsController.createTab);
router.get("/:tabId", tabsController.getTab);
router.put("/:tabId", tabsController.updateTab);
router.delete("/:tabId", tabsController.deleteTab);

module.exports = router;

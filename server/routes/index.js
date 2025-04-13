const { Router } = require("express");
const router = Router();
const db = require("../db/queries");
const usersController = require("../controllers/usersController");

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("signup"));
router.get("/test", (req, res) => res.render("test"));
router.get("/tabs", async (req, res) => {
  try {
    const user = res.locals.currentUser;
    if (!user) {
      res.redirect("/login");
    } else {
      const tabs = await db.getTabsByUser(user.id);
      console.log(tabs);
      res.json(tabs);
      res.status(201);
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;

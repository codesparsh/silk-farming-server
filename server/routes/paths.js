const router = require('express').Router();
const controller = require('./index');
router.post("/signup", controller.signup)
router.post("/signin", controller.signin)
router.post("/user/update", controller.updateUserDetails)
router.post("/list/feeds", controller.listFeeds)
router.post("/register", controller.registration)
router.get("/", controller.healthCheck)

module.exports = router;
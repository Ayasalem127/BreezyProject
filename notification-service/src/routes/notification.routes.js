const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification.controller");
const auth = require("../middleware/auth");

router.post("/", controller.createNotification);
router.get("/", controller.getMyNotifications);
router.patch("/:id/read", controller.markAsRead);

module.exports = router;

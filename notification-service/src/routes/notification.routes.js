const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification.controller");

const requireRole=require("../middleware/requireRole");
router.post("/", controller.createNotification);
router.get("/",requireRole('user'), controller.getMyNotifications);
router.patch("/:id/read", controller.markAsRead);

module.exports = router;

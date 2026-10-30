const express = require("express");

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getMyEvents,
  getEventById,
  joinEvent,
  leaveEvent,
} = require("../controllers/eventController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getEvents);
router.get("/my-events", protect, getMyEvents);
router.put("/:id", protect, updateEvent);
router.delete("/:id/leave", protect, leaveEvent);
router.delete("/:id", protect, deleteEvent);
router.get("/:id", protect, getEventById);
router.post("/:id/join", protect, joinEvent);




module.exports = router;
const express = require("express");

const {
  createClub,
  getClubs,
  getMyClubs,
  getClubById,
  joinClub,
  leaveClub,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createClub);
router.get("/", protect, getClubs);
router.get("/my-clubs", protect, getMyClubs);
router.put("/:id", protect, updateClub);
router.delete("/:id", protect, deleteClub);
router.get("/:id", protect, getClubById);
router.post("/:id/join", protect, joinClub);
router.delete("/:id/leave", protect, leaveClub);


module.exports = router;
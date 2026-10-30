const express = require("express");
const protect = require("../middleware/authMiddleware");
const { uploadSinglePDF } = require("../middleware/uploadMiddleware");
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  downloadResource,
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/", protect, uploadSinglePDF, createResource);
router.get("/", protect, getResources);
router.get("/:id/download", protect, downloadResource);
router.put("/:id", protect, uploadSinglePDF, updateResource);
router.delete("/:id", protect, deleteResource);
router.get("/:id", protect, getResourceById);

module.exports = router;

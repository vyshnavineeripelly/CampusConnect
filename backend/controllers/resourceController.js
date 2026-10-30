const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const uploadBuffer = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        type: "authenticated",
        access_mode: "authenticated",
        folder: "campusconnect/resources",
        use_filename: true,
        unique_filename: true,
        filename_override: originalName,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

const getDownloadUrls = (resource) => [
  cloudinary.utils.private_download_url(
    resource.filePublicId,
    "pdf",
    {
      resource_type: "raw",
      type: "authenticated",
      attachment: true,
    }
  ),
  cloudinary.utils.private_download_url(
    resource.filePublicId,
    "pdf",
    {
      resource_type: "raw",
      type: "upload",
      attachment: true,
    }
  ),
];

const validateTextFields = (body, required = false) => {
  const allowedFields = ["title", "description", "category", "subject"];
  const cleaned = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      cleaned[field] =
        typeof body[field] === "string" ? body[field].trim() : "";
    }
  }

  if (required) {
    for (const field of allowedFields) {
      if (!cleaned[field]) {
        return { error: `${field} is required` };
      }
    }
  }

  return { cleaned };
};

const isPDFBuffer = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 5 &&
  buffer.subarray(0, 5).toString("ascii") === "%PDF-";

const createResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "A PDF file is required",
      });
    }

    if (!isPDFBuffer(req.file.buffer)) {
      return res.status(400).json({
        success: false,
        message: "The selected file is not a valid PDF",
      });
    }

    const validation = validateTextFields(req.body, true);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const uploaded = await uploadBuffer(
      req.file.buffer,
      req.file.originalname
    );

    const resource = await Resource.create({
      ...validation.cleaned,
      uploadedBy: req.user._id,
      fileUrl: uploaded.secure_url,
      filePublicId: uploaded.public_id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    await resource.populate("uploadedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Create resource error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading resource",
    });
  }
};

const getResources = async (req, res) => {
  try {
    const query = {};
    const search = typeof req.query.search === "string"
      ? req.query.search.trim()
      : "";
    const category = typeof req.query.category === "string"
      ? req.query.category.trim()
      : "";

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { subject: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    console.error("Get resources error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while getting resources",
    });
  }
};

const getResourceById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findById(req.params.id)
      .populate("uploadedBy", "name email");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("Get resource error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while getting resource",
    });
  }
};

const updateResource = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this resource",
      });
    }

    const validation = validateTextFields(req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    Object.assign(resource, validation.cleaned);

    if (req.file) {
      if (!isPDFBuffer(req.file.buffer)) {
        return res.status(400).json({
          success: false,
          message: "The selected file is not a valid PDF",
        });
      }

      const uploaded = await uploadBuffer(
        req.file.buffer,
        req.file.originalname
      );

      await cloudinary.uploader.destroy(resource.filePublicId, {
        resource_type: "raw",
        type: "authenticated",
      });

      resource.fileUrl = uploaded.secure_url;
      resource.filePublicId = uploaded.public_id;
      resource.originalName = req.file.originalname;
      resource.mimeType = req.file.mimetype;
      resource.fileSize = req.file.size;
    }

    await resource.save();
    await resource.populate("uploadedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Update resource error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating resource",
    });
  }
};

const deleteResource = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this resource",
      });
    }

    await cloudinary.uploader.destroy(resource.filePublicId, {
      resource_type: "raw",
      type: "authenticated",
    });
    await Resource.findByIdAndDelete(resource._id);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting resource",
    });
  }
};

const downloadResource = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    let response = null;
    for (const downloadUrl of getDownloadUrls(resource)) {
      response = await fetch(downloadUrl);
      if (response.ok) break;
    }

    if (!response || !response.ok) {
      console.error(
        "Cloudinary resource download failed:",
        response.status
      );
      return res.status(502).json({
        success: false,
        message: "Unable to download this resource",
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const safeName = resource.originalName.replace(/[^\w.-]+/g, "_");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": buffer.length,
      "Cache-Control": "private, no-store",
    });
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Download resource error:", error);
    return res.status(502).json({
      success: false,
      message: "Unable to download this resource",
    });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  downloadResource,
};

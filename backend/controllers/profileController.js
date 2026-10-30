const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        notificationPreferences: user.notificationPreferences || { inApp: true },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, college, department, year, bio, skills, interests } =
      req.body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (year !== undefined && (!Number.isInteger(Number(year)) || Number(year) < 1 || Number(year) > 6)) {
      return res.status(400).json({ success: false, message: "Year must be between 1 and 6" });
    }
    for (const [key, value] of [["skills", skills], ["interests", interests]]) {
      if (value !== undefined && (!Array.isArray(value) || value.some((item) => typeof item !== "string"))) {
        return res.status(400).json({ success: false, message: `${key} must be an array of strings` });
      }
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name.trim();
    if (college !== undefined) user.college = college;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = Number(year);
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};

const updateNotificationPreferences = async (req, res) => {
  try {
    if (typeof req.body.inApp !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Notification preference must be a boolean",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.notificationPreferences = {
      inApp: req.body.inApp,
    };
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification preferences saved",
      data: user.notificationPreferences,
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving notification preferences",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateNotificationPreferences,
};
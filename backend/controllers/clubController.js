const Club = require("../models/Club");
const { createNotification } = require("../services/notificationService");

const createClub = async (req, res) => {
  try {
    const { name, description, category, college } = req.body;

    if (!name || !description || !category || !college) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required club fields",
      });
    }

    const club = await Club.create({
      name,
      description,
      category,
      college,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: "Club created successfully",
      data: club,
    });
  } catch (error) {
    console.error("Create club error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating club",
    });
  }
};

const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    console.error("Get clubs error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting clubs",
    });
  }
};

const getMyClubs = async (req, res) => {
  try {
    const clubs = await Club.find({
      members: req.user._id,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your clubs",
    });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    console.error("Get club error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting club",
    });
  }
};

const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const alreadyMember = club.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this club",
      });
    }

    club.members.push(req.user._id);

    await club.save();

    await createNotification({
      recipientId: club.createdBy,
      actorId: req.user._id,
      type: "club_join",
      message: `${req.user.name} joined your club "${club.name}"`,
      relatedType: "club",
      relatedId: club._id,
    });

    return res.status(200).json({
      success: true,
      message: "Joined club successfully",
      data: club,
    });
  } catch (error) {
    console.error("Join club error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while joining club",
    });
  }
};

const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.createdBy.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Club creators cannot leave their own club",
      });
    }

    const wasMember = club.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    club.members = club.members.filter(
      (member) => member.toString() !== req.user._id.toString()
    );

    await club.save();

    if (wasMember) {
      await createNotification({
        recipientId: club.createdBy,
        actorId: req.user._id,
        type: "club_leave",
        message: `${req.user.name} left your club "${club.name}"`,
        relatedType: "club",
        relatedId: club._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Left club successfully",
      data: club,
    });
  } catch (error) {
    console.error("Leave club error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while leaving club",
    });
  }
};

const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this club",
      });
    }

    const { name, description, category, college } = req.body;

    club.name = name ?? club.name;
    club.description = description ?? club.description;
    club.category = category ?? club.category;
    club.college = college ?? club.college;

    await club.save();

    res.status(200).json({
      success: true,
      message: "Club updated successfully",
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this club",
      });
    }

    await Club.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createClub,
  getClubs,
  getMyClubs,
  getClubById,
  joinClub,
  leaveClub,
  updateClub,
  deleteClub,
};
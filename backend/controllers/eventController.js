const Event = require("../models/Event");
const { createNotification } = require("../services/notificationService");

const updateEvent = async (req, res) => {
  try {
    const { title, description, category, date, location } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only the event creator can edit it
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this event",
      });
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (category !== undefined) event.category = category;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Update event error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating event",
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only the event creator can delete it
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting event",
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      location,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required event fields",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      organizer: req.user._id,
      attendees: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating event",
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting events",
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user._id,
    })
      .populate("organizer", "name email")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get my events error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting your events",
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("attendees", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting event",
    });
  }
};

const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyJoined = event.attendees.some(
      (attendee) => attendee.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this event",
      });
    }

    event.attendees.push(req.user._id);

    await event.save();

    await createNotification({
      recipientId: event.organizer,
      actorId: req.user._id,
      type: "event_join",
      message: `${req.user.name} joined your event "${event.title}"`,
      relatedType: "event",
      relatedId: event._id,
    });

    return res.status(200).json({
      success: true,
      message: "Event joined successfully",
      data: event,
    });
  } catch (error) {
    console.error("Join event error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while joining event",
    });
  }
};

const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const wasAttendee = event.attendees.some(
      (attendee) => attendee.toString() === req.user._id.toString()
    );

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user._id.toString()
    );

    await event.save();

    if (wasAttendee) {
      await createNotification({
        recipientId: event.organizer,
        actorId: req.user._id,
        type: "event_leave",
        message: `${req.user.name} left your event "${event.title}"`,
        relatedType: "event",
        relatedId: event._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "You left the event",
      data: event,
    });
  } catch (error) {
    console.error("Leave event error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while leaving event",
    });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getMyEvents,
  getEventById,
  joinEvent,
  leaveEvent,
};
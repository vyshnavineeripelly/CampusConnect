const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },

    bio: {
  type: String,
  default: "",
  trim: true,
},

skills: {
  type: [String],
  default: [],
},

interests: {
  type: [String],
  default: [],
},

profileImage: {
  type: String,
  default: "",
},

notificationPreferences: {
  inApp: {
    type: Boolean,
    default: true,
  },
},

    role: {
      type: String,
      enum: ["student", "club_admin", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
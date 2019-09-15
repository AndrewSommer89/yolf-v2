const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  city: {
    type: String
  },
  homeCourse: {
    type: String
  },
  bio: {
    type: String
  },
  social: {
    instagram: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    }
  },
  scores: [
    {
      date: {
        type: Date
      },
      course: {
        type: String
      },
      putts: {
        type: Number,
        required: true
      },
      scoreToPar: {
        type: Number,
        required: true
      },
      eagles: {
        type: Number,
        required: true
      },
      birdies: {
        type: Number,
        required: true
      },
      pars: {
        type: Number,
        required: true
      },
      bogeys: {
        type: Number,
        required: true
      },
      doubleBogeys: {
        type: Number,
        required: true
      },
      tripleBogeys: {
        type: Number,
        required: true
      }
    }
  ],
  date: {
    type: Date
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);

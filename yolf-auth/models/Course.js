const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  backtTeeRating: {
    type: Number,
    required: true
  },
  backTeeSlope: {
    type: Number,
    required: true
  },
  middleTeeRating: {
    type: Number,
    required: true
  },
  middleTeeSlope: {
    type: Number,
    required: true
  },
  frontTeeRating: {
    type: Number,
    required: true
  },
  frontTeeSlope: {
    type: Number,
    required: true
  },
  hole1: {
    type: Number,
    required: true
  },
  hole2: {
    type: Number,
    required: true
  },
  hole3: {
    type: Number,
    required: true
  },
  hole4: {
    type: Number,
    required: true
  },
  hole5: {
    type: Number,
    required: true
  },
  hole6: {
    type: Number,
    required: true
  },
  hole7: {
    type: Number,
    required: true
  },
  hole8: {
    type: Number,
    required: true
  },
  hole9: {
    type: Number,
    required: true
  },
  hole10: {
    type: Number,
    required: true
  },
  hole11: {
    type: Number,
    required: true
  },
  hole12: {
    type: Number,
    required: true
  },
  hole13: {
    type: Number,
    required: true
  },
  hole14: {
    type: Number,
    required: true
  },
  hole15: {
    type: Number,
    required: true
  },
  hole16: {
    type: Number,
    required: true
  },
  hole17: {
    type: Number,
    required: true
  },
  hole18: {
    type: Number,
    required: true
  }
});

module.exports = Course = mongoose.model("course", CourseSchema);

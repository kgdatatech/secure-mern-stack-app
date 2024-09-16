const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a program name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  cost: {
    type: Number,
    required: [true, 'Please add a cost']
  },
  ageGroup: {
    type: String,
    required: [true, 'Please add an age group']
  },
  classSize: {
    type: Number,
    required: [true, 'Please add a class size']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;

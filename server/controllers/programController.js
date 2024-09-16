//server\controllers\programController.js
const Program = require('../models/Program');

// Get all programs
exports.getAllPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find();

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get a single program
exports.getProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'No program found',
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Create a new program
exports.createProgram = async (req, res, next) => {
  const { name, description, duration, startDate, endDate, cost, ageGroup, classSize, location } = req.body;

  try {
    const program = await Program.create({
      name,
      description,
      duration,
      startDate,
      endDate,
      cost,
      ageGroup,
      classSize,
      location,
    });

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Update an existing program
exports.updateProgram = async (req, res, next) => {
  const { name, description, duration, startDate, endDate, cost, ageGroup, classSize, location } = req.body;

  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { name, description, duration, startDate, endDate, cost, ageGroup, classSize, location },
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'No program found',
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Duplicate a program
exports.duplicateProgram = async (req, res, next) => {
  try {
    const originalProgram = await Program.findById(req.params.id);

    if (!originalProgram) {
      return res.status(404).json({
        success: false,
        error: 'No program found',
      });
    }

    const { name, description, duration, startDate, endDate, cost, ageGroup, classSize, location } = originalProgram;
    const duplicatedProgram = await Program.create({
      name,
      description,
      duration,
      startDate,
      endDate,
      cost,
      ageGroup,
      classSize,
      location,
    });

    res.status(200).json({
      success: true,
      data: duplicatedProgram,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Delete a program
exports.deleteProgram = async (req, res, next) => {
  try {
    await Program.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

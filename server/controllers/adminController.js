const User = require('../models/User');
const bcrypt = require('bcryptjs');


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, name } = req.body;

    // Validate inputs
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if role is not provided
      name,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { username, email, password, role, name } = req.body;

    const updatedUser = {
      username,
      email,
      role: role || 'user', // Default to 'user' if role is not provided
      name,
    };

    if (password) {
      updatedUser.password = await bcrypt.hash(password, 12); // Hash password if provided
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, { new: true });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

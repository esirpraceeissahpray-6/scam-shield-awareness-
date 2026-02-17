/**
 * Hybrid Scam Shield AI
 * Users Routes
 *
 * Purpose:
 * - Handle user registration, login, profile, and admin management
 * - Enforce authentication and role-based access
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorHandler');

// Helper: generate JWT
const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * @route POST /api/users/register
 * Register a new user
 */
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
}));

/**
 * @route POST /api/users/login
 * Authenticate user & get token
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
}));

/**
 * @route GET /api/users
 * List all users (admin only)
 */
router.get('/', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
}));

/**
 * @route GET /api/users/:id
 * Get single user profile (admin or self)
 */
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(user);
}));

/**
 * @route PATCH /api/users/:id
 * Update user (admin or self)
 */
router.patch('/:id', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { name, email, password, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  if (role && req.user.role === 'admin') user.role = role;

  const updatedUser = await user.save();
  res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
}));

/**
 * @route DELETE /api/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.remove();
  res.json({ message: 'User removed' });
}));

// Error handler
router.use(errorHandler);

module.exports = router;

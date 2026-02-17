const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Community = require('../models/Community');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorHandler');

// Create a new community (admin only)
router.post('/', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const existing = await Community.findOne({ name });
  if (existing) throw new Error('Community already exists');

  const community = await Community.create({ name, description, createdBy: req.user._id });
  res.status(201).json(community);
}));

// List all communities
router.get('/', asyncHandler(async (req, res) => {
  const communities = await Community.find({}).populate('createdBy', 'name').sort({ createdAt: -1 });
  res.status(200).json(communities);
}));

// Get single community details
router.get('/:id', asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id).populate('createdBy', 'name');
  if (!community) throw new Error('Community not found');
  res.status(200).json(community);
}));

// Update community (admin only)
router.patch('/:id', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) throw new Error('Community not found');

  const { name, description } = req.body;
  if (name) community.name = name;
  if (description) community.description = description;

  const updatedCommunity = await community.save();
  res.status(200).json(updatedCommunity);
}));

// Delete community (admin only)
router.delete('/:id', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) throw new Error('Community not found');

  await community.remove();
  res.status(200).json({ message: 'Community deleted' });
}));

router.use(errorHandler);

module.exports = router;

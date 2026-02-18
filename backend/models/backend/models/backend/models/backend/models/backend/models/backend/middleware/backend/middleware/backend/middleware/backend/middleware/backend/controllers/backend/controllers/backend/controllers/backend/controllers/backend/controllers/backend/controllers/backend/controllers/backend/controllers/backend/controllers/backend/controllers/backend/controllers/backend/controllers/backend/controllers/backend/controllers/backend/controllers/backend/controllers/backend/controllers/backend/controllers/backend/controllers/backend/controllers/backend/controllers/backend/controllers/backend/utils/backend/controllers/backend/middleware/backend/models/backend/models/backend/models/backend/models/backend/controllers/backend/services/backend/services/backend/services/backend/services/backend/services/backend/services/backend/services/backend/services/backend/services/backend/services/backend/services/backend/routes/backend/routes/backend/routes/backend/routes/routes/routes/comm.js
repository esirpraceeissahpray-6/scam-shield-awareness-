const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Create community (admin)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  const { name, description } = req.body;

  const exists = await Community.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Community exists' });

  const community = await Community.create({
    name,
    description,
    createdBy: req.user._id
  });

  res.status(201).json(community);
});

// Get all communities
router.get('/', async (req, res) => {
  const communities = await Community.find().populate('createdBy', 'name');
  res.json(communities);
});

// Delete community (admin)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  await Community.findByIdAndDelete(req.params.id);
  res.json({ message: 'Community deleted' });
});

module.exports = router;

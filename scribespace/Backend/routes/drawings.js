const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Drawing = require('../models/Drawing');

// Route to save drawing
router.post('/save', fetchUser, async (req, res) => {
  try {
    const drawing = new Drawing({
      user: req.user.id,
      drawingData: req.body.drawingData
    });

    const savedDrawing = await drawing.save();
    res.json(savedDrawing);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch all drawings for a user
router.get('/fetch', fetchUser, async (req, res) => {
  try {
    const drawings = await Drawing.find({ user: req.user.id }).sort({ date: -1 });
    res.json(drawings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route to delete a drawing
router.delete('/delete/:id', fetchUser, async (req, res) => {
  try {
    let drawing = await Drawing.findById(req.params.id);
    if (!drawing) {
      return res.status(404).send('Drawing not found');
    }

    // Verify user owns this drawing
    if (drawing.user.toString() !== req.user.id) {
      return res.status(401).send('Not authorized');
    }

    drawing = await Drawing.findByIdAndDelete(req.params.id);
    res.json({ success: 'Drawing deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router; 
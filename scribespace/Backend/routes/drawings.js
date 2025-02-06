const express = require('express');
const router = express.Router();
const Drawing = require('../models/Drawing');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// Route 1: Get all drawings - GET "/api/drawings/fetch". Login required
router.get('/fetch', fetchUser, async (req, res) => {
  try {
    const drawings = await Drawing.find({ user: req.user.id });
    res.json(drawings);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route 2: Add a new drawing - POST "/api/drawings/add". Login required
router.post('/add', fetchUser, [
  body('drawingData', 'Drawing data is required').exists(),
], async (req, res) => {
  try {
    const { drawingData, title } = req.body;
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new drawing
    const drawing = new Drawing({
      drawingData,
      title: title || undefined, // Use default if not provided
      user: req.user.id
    });

    const savedDrawing = await drawing.save();
    res.json(savedDrawing);

  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route 3: Delete a drawing - DELETE "/api/drawings/delete/:id". Login required
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
    res.status(500).send('Internal Server Error');
  }
});

// Add this route to update drawing title
router.put('/update/:id', fetchUser, async (req, res) => {
  try {
    const { title } = req.body;
    
    // Find the drawing and check if it exists
    let drawing = await Drawing.findById(req.params.id);
    if (!drawing) {
      return res.status(404).send('Drawing not found');
    }

    // Verify user owns this drawing
    if (drawing.user.toString() !== req.user.id) {
      return res.status(401).send('Not authorized');
    }

    // Update the drawing title
    drawing = await Drawing.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    res.json(drawing);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router; 
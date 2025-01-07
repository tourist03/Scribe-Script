const mongoose = require('mongoose');
const { Schema } = mongoose;

const DrawingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  drawingData: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('drawings', DrawingSchema); 
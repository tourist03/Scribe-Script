const mongoose = require('mongoose');
const { Schema } = mongoose;

const DrawingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    default: function() {
      return `Drawing ${new Date().toLocaleDateString()}`;
    }
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
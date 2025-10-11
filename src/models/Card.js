import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  columnId: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    default: 0
  },
  suggestions: [String],
  embedding: [Number],
  clusterId: String,
  mood: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  color: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Card || mongoose.model('Card', CardSchema);
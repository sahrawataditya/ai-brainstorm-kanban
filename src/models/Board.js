import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My Brainstorming Board'
  },
  columns: [{
    id: String,
    title: String,
    cardIds: [String],
    color: String
  }],
  sharedWith: [{
    userId: mongoose.Schema.Types.ObjectId,
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  aiSummary: {
    themes: [String],
    topIdeas: [String],
    nextSteps: [String],
    generatedAt: Date
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

export default mongoose.models.Board || mongoose.model('Board', BoardSchema);
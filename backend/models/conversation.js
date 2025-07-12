import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Messages', 
    }
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const ConversationModel = mongoose.model('Conversation', ConversationSchema);
export default ConversationModel;
import ConversationModel from "../models/conversation.js";
import MessageModel from "../models/messages.js";

export const SendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
  
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: `${!senderId ? "Sender Id" : !receiverId ? "Receiver Id" : "Message"} is required.`,
      });
    }
  
    try {
      
      const newMessage = new MessageModel({
        userId: senderId,
        message,
      });
      
     
      const savedMessage = await newMessage.save();
  
     
      let conversation = await ConversationModel.findOne({
        members: { 
          $all: [senderId, receiverId],
          $size: 2
        }
      });
  
      if (conversation) {
       
        conversation = await ConversationModel.findByIdAndUpdate(
          conversation._id,
          {
            $push: { messages: savedMessage._id }
          },
          { new: true }
        );
      } else {
       
        conversation = await ConversationModel.create({
          members: [senderId, receiverId],
          messages: [savedMessage._id]
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: {
          newMessage: savedMessage,
          conversation: conversation,
        },
      });
    } catch (error) {
      console.error("Message error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send message. Please try again." 
      });
    }
  };
  
export const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.body;
  // console.log('sendia',senderId,'reciverid')
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: `${!senderId ? "Sender Id" : "Receiver Id"} is required.`,
      });
    }

    try {
 
      const conversation = await ConversationModel.findOne({
        members: {
          $all: [senderId, receiverId],
          $size: 2
        }
      }).populate('messages');

      if (!conversation) {
             const newConversation=  await ConversationModel.create({
          members: [senderId, receiverId],
        
        });
        return res.status(200).json({
          success: true,
          message: "Conversation created successfully",
          data: newConversation,
        });
      }

      res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: conversation.messages,
      });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve messages. Please try again."
      });
    }
  };
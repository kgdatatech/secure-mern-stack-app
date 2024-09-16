const Notification = require('../models/Notification');

exports.sendNotification = async (userId, message, type, io) => {
  try {
    console.log(`Sending notification to userId: ${userId} with message: ${message} and type: ${type}`);
    
    // Create a new notification instance
    const notification = new Notification({ userId, message, type });
    
    // Save the notification to the database
    await notification.save();
    console.log(`Notification saved: ${notification._id}`);
    
    // Emit the notification to the specified user's socket room
    io.to(userId).emit('newNotification', notification);
    console.log(`Notification emitted to user: ${userId}`);
    
    return notification; // Return the notification object
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error; // Re-throw the error for higher-level handling if needed
  }
};

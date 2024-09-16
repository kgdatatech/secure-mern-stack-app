const mongoose = require('mongoose');

// Define a simple schema for logs if not already defined
const logSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  referrer: String,
  timestamp: Date,
}, { collection: 'logs' });

const performanceSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  duration: Number, // in milliseconds
  timestamp: Date,
}, { collection: 'performance' });

const Log = mongoose.model('Log', logSchema);
const Performance = mongoose.model('Performance', performanceSchema);

/**
 * Save log data to the database
 * @param {Object} logData - The log data object
 */
const saveLogToDatabase = async (logData) => {
    try {
      // If the user is a guest, set the user field to null
      if (logData.user === 'guest') {
        logData.user = null;
      }
  
      const logEntry = new Log(logData);
      await logEntry.save();
      console.log('Log saved successfully');
    } catch (error) {
      console.error('Error saving log to database:', error);
    }
  };

/**
 * Save performance data to the database
 * @param {Object} performanceData - The performance data object
 */
const savePerformanceData = async (performanceData) => {
  try {
    const performanceEntry = new Performance(performanceData);
    await performanceEntry.save();
    console.log('Performance data saved successfully');
  } catch (error) {
    console.error('Error saving performance data to database:', error);
  }
};

module.exports = {
  saveLogToDatabase,
  savePerformanceData,
};

const mongoose = require('mongoose');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        socketTimeoutMS: 45000,
      });

      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
      
      // Connection events
      mongoose.connection.on('connected', () => {
        logger.info('Mongoose connected to MongoDB');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Mongoose disconnected from MongoDB');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('Mongoose connection closed due to app termination');
        process.exit(0);
      });

    } catch (error) {
      logger.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  // Get connection status
  getStatus() {
    return {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  // Disconnect from database
  async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info('Mongoose disconnected successfully');
    } catch (error) {
      logger.error('Mongoose disconnect error:', error);
    }
  }
}

module.exports = new Database();

const pool = require("../db/pool");
const notificationQueries = require("./../db/queries/notification");

let io = null; // Socket.IO instance

// Set Socket.IO instance for real-time updates
const setSocketIO = (socketIO) => {
  io = socketIO;
};

const startNotificationEmitter = () => {
  setInterval(async () => {
    try {
      const { rows } = await pool.query(notificationQueries.getNotifications); // Query all appointments
      if (io) {
        io.emit("appointments", rows); // Emit all appointments in real-time
      }
    } catch (err) {
      console.error("Error emitting appointments:", err);
    }
  }, 5000); // Emit every 5 seconds
};

module.exports = {
  setSocketIO,
  startNotificationEmitter,
};

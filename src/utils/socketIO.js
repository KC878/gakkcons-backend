const { Server } = require("socket.io");

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("register", (userId) => {
      if (!socket.rooms.has(userId)) {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });
  return io;
};

module.exports = {
  initSocket,
};

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const api = require("./routes");
const { setSocketIO, startNotificationEmitter } = require("./utils/socketIO");

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Set up Socket.IO for notifications
setSocketIO(io);
startNotificationEmitter();

// Socket.IO connection to handle real-time interactions
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/api", api);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

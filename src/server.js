const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const api = require("./routes");
const { setSocketIO, startNotificationEmitter } = require("./utils/socketIO");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

setSocketIO(io);
startNotificationEmitter();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/api", api);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

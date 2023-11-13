const express = require("express");
const app = express();
const socketio = require("socket.io");
const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// manufacturef way to change a ns
app.get("/change-ns", (req, res) => {
  // upadate namespaces array
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  //let everyone know in THIS namespace,that it
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

io.of("/").on("connection", (socket) => {
  socket.on("clientConnect", () => {
    console.log(socket.id, "has connected");
    socket.emit("nsList", namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} has connected to ${namespace.endpoint}`);
    socket.on("joinRoom", async (roomTitle, ackCallBack) => {
      // leave all room (except own room), because the client can only be in one room
      const rooms = socket.rooms;
      console.log(rooms); // Set(1) { 'ijy2u_OVkVrYd6ufAAAH' }
      let i = 0;
      rooms.forEach((room) => {
        // we don't want to leave the socket's personal room which is guaranteed to be first
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      // NOTE! roomTitle is coming from the client. Which is NOT safe.
      // Auth to make sure the socket has right to be in that room
      socket.join(roomTitle);

      // fetch the nu,brt of sockets in this room
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomTitle)
        .fetchSockets();
      const socketCount = sockets.length;
      ackCallBack({
        numUsers: socketCount,
      });
    });
  });
});

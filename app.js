const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const port = 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
    let users = [];
    for (let [socket] of io.of("/").sockets) {
      users.push({
        userid: socket.userid,
        username: socket.username,
      });
    }
    socket.emit("users", users);

    // broadcast newly connected user
    socket.broadcast.emit("user connected", {
        userid: socket.userid,
        username: socket.username,
    });
    
    // emit message to receiver
    socket.on("private message", ({ content, to }) => {
        socket.to(to).emit("private message", {
          content,
          from: {
            userid: socket.userid,
            username: socket.username
          }
        });
    });
});

io.use((socket, next) => {
    const userid = socket.handshake.auth.userid;
    const username = socket.handshake.auth.username;
    console.log("userid:", userid, "username:", username);

    if (!userid || !username) {
        return next(new Error("invalid userid"));
    }
    socket.userid = userid;
    socket.username = username;

    next();
});

httpServer.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
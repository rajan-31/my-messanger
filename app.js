const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const port = 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

// stored chats
let MessangerUsers = [
  {
    userid: 123,
    username: "Rajan",
    chats: [
      {
          userid: 789,
          username: "Rohan",
          messages: [{who: "him",msg:"hii"}, {who: "me",msg:"How are you?"}]
      }
    ]
  },
  {
    userid: 789,
    username: "Rohan",
    chats: [
      {
          userid: 123,
          username: "Rajan",
          messages: [{who: "him",msg:"hey"}, {who: "me",msg:"Nice to see you?"}]
      }
    ]
  }
]

io.on("connection", (socket) => {
    // send chats
    for(let i=0; i<MessangerUsers.length; i++) {
      const user = MessangerUsers[i];
      if(user.userid == socket.userid) {
        const myChats = user.chats;
        socket.emit("my chats", myChats);

        break;
      }
    }

    // join own room
    socket.join(socket.userid);

    // broadcast newly connected user
    socket.broadcast.emit("user connected", {
        userid: socket.userid,
        username: socket.username,
    });
    
    // emit message to receiver
    socket.on("private message", ({ content, to }) => {
      // persist data
      for(let i=0; i<MessangerUsers.length; i++) {
        const user = MessangerUsers[i];
        if(user.userid == socket.userid) {
          const allChats = user.chats;
          for(let j=0; j<allChats.length; i++) {
            if(allChats[j].userid==to) {
              MessangerUsers[i].chats[j].messages.push({who: "me", msg: content});

              break
            }
          }

          break;
        } 
      }

      for(let i=0; i<MessangerUsers.length; i++) {
        const user = MessangerUsers[i];
        if(user.userid == to) {
          const allChats = user.chats;
          for(let j=0; j<allChats.length; i++) {
            if(allChats[j].userid==socket.userid) {
              MessangerUsers[i].chats[j].messages.push({who: "him", msg: content});

              break
            }
          }

          break;
        } 
      }

      // send to receiver
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
    let username;
    for(let i=0; i<MessangerUsers.length; i++) {
      const user = MessangerUsers[i];
      if(user.userid == userid) {
        username = user.username;

        break;
      }
    }

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
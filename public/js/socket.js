let users;
let chats = [
    {
        userid: 123,
        username: "rajan",
    },
    {
        userid: 789,
        username: "rohan",
        messages: [{who: "him",msg:"hii"}, {who: "me",msg:"How are you?"}]
    }
];
let selectedUser;

$("#submit-userid").on("click", () => {
    const userid = $("#userid").val()
    const username = $("#username").val()
    if(userid) {
        const URL = "http://localhost:8080";

        const socket = io(URL, { autoConnect: false});
        // connection
        socket.auth = { userid, username }
        socket.connect();
        
        // listen to all events for development purpose
        socket.onAny((event, ...args) => {
            console.log("Listening all =>", event, args);
        });
        
        // handle connection err
        socket.on("connect_error", (err) => {
            console.log("CONNECTION eRRor!!!!")
        });

        // all users
        socket.on("users", (users) => {
            users=
            console.log("all users =>", users);
        });

        socket.on("user connected", (user) => {
            $("#all-users").append(`<li>User ID: ${user.userid}, User Name: ${user.username}`);
        });

        socket.on("private message", ({ content, from }) => {
            let i;
            for(i = 0; i< chats.length; i++) {
                const user = chats[i];
                if (user.userid == from.userid) {
                    // push msg to appropriate user
                    chats[i].messages.push(content);
                    // add icon to user with msg if it's not current user we are chatting
                    $("div .select-box[data-userid=" + user.userid +"]").children(".notify").addClass("fas fa-envelope");

                    break;
                }
            }

            // user not in chats
            if(i==chats.length) {
                chats.append({
                    userid: from.userid,
                    username: from.username,
                    messages: [content]
                });
                $("#user-pane").append(`
                <div data-userid=${"from.userid"} class="select-box d-flex">
                    <div class="fas fa-circle text-warning my-auto"></div>
                    <div>&nbsp;${from.username}</div>
                    <div class="fas fa-envelope notify text-success ml-auto"></div>
                </div>
                `);
            }
        });
    }
});

$("#send-btn").click(() => {
    const send_to = $(".selected-box").attr("data-userid");
    const send_msg = $("#send-message").val();
    if(send_to && send_msg) {
        socket.emit("private message", {
            content: send_msg,
            to: send_to
        });
        $("#send-message").val("");
    }
});


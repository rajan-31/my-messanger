let chats ;
let selectedUser;

$("#submit-userid").on("click", () => {
    const userid = $("#userid").val()
    if(userid) {
        const URL = "http://localhost:8080";

        const socket = io(URL, { autoConnect: false});
        // connection
        socket.auth = { userid }
        socket.connect();

        // retrive chats
        socket.on("my chats", (myChats) => {

            // if statement because on server restart chats user will be added again
            if($("#user-pane").length == 0) {
                chats = myChats;
                for(let i=0; i<myChats.length; i++) {
                    const user = myChats[i];
                    $("#user-pane").append(`
                    <div data-userid=${user.userid} class="select-box d-flex">
                        <div class="fas fa-circle text-warning my-auto">&nbsp;</div>
                        <div class="select-box-username">${user.username}</div>
                        <div class="notify text-success ml-auto"></div>
                    </div>
                    `);
                }
                addClickListenerToUserList();
            }
        });
        
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
                    chats[i].messages.push({ who: "him", msg: content});

                    if(from.userid == selectedUser) {
                        $("#message-pane").append(`
                            <div class="message-rec d-flex flex-row">
                                <span class="left-triangle"></span>
                                <span class="message">${content}</span>
                            </djv>
                        `);
                    } else {
                        // add icon to user with msg if it's not current user we are chatting
                        $("div .select-box[data-userid=" + user.userid +"]").children(".notify").addClass("fas fa-envelope my-auto");
                    }

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
                        <div class="fas fa-circle text-warning my-auto">&nbsp;</div>
                        <div>${from.username}</div>
                        <div class="fas fa-envelope notify text-success ml-auto"></div>
                    </div>
                `);

                addClickListenerToUserList();
            }
        });

        // UI handlers
        $("#send-btn").click(() => {
            const send_to = $(".selected-box").attr("data-userid");
            const send_msg = $("#send-message").val();
            if(send_to && send_msg) {
                socket.emit("private message", {
                    content: send_msg,
                    to: send_to
                });
                $("#send-message").val("");

                // append new message in ui & array of msgs
                for(i = 0; i< chats.length; i++) {
                    const user = chats[i];
                    if (user.userid == send_to) {
                        // push msg to appropriate user
                        chats[i].messages.push({who: "me",msg:send_msg});

                        break;
                    }
                }

                $messages=$("#message-pane");
                $messages.append(`
                    <div class="message-sent d-flex flex-row-reverse">
                        <span class="right-triangle"></span>
                        <span class="message">${send_msg}</span>
                    </div>
                `);

                scrollSmoothToBottom("message-pane");
            }
        });
    }
});



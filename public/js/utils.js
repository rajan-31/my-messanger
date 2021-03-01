function scrollToBottom (id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function scrollSmoothToBottom (id) {
    var div = document.getElementById(id);
    $('#' + id).animate({
       scrollTop: div.scrollHeight - div.clientHeight
    }, 500);
}

function addClickListenerToUserList() {

    $( ".select-box" ).click(function() {
        $( ".select-box" ).removeClass( "selected-box" );
        $this = $( this );
        $this.addClass( "selected-box" );
        selectedUser = $this.attr("data-userid");

        // remove notify icon
        $this.children(".notify").removeClass("fas fa-envelope my-auto");

        // show selected user at top of chat
        $("#selcted-user-details").removeAttr("hidden");
        $("#message-pane").removeAttr("hidden");
        $("#type-pane").removeClass("d-none").addClass("d-flex");
        const selectedUser_username = $this.children(".select-box-username").text();
        $("#chat-username").text(selectedUser_username);


        // show messages
        $messages=$("#message-pane");
        $messages.html("");
        for(let i=0; i<chats.length; i++) {
            const user = chats[i];
            if(user.userid==selectedUser && user.messages){
                for(let j=0; j<user.messages.length; j++) {
                    if(user.messages[j].who=="him"){
                        $messages.append(`
                            <div class="message-rec d-flex flex-row">
                                <span class="left-triangle"></span>
                                <span class="message">${user.messages[j].msg}</span>
                            </djv>
                        `);
                    }
                    else
                        $messages.append(`
                            <div class="message-sent d-flex flex-row-reverse">
                                <span class="right-triangle"></span>
                                <span class="message">${user.messages[j].msg}</span>
                            </div>
                        `);
                }

                break;
            }        
        }

        scrollToBottom("message-pane");
    });

}
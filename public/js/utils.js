$( ".select-box" ).click(function() {
    $( ".select-box" ).removeClass( "selected-box" );
    $( this ).addClass( "selected-box" );
    selectedUser = $( this ).attr("data-userid");

    // show messages
    $messages=$("#message-pane");
    $messages.html("");
    for(let i=0; i<chats.length; i++) {
        const user = chats[i];
        if(user.userid==selectedUser && user.messages){
            for(let j=0; j<user.messages.length; j++) {
                if(user.messages[j].who=="him")
                    $messages.append(`
                        <div class="message-rec d-flex flex-row">
                            <span class="left-triangle"></span>
                            <span class="message">${user.messages[j].msg}</span>
                        </djv>
                    `);
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
});
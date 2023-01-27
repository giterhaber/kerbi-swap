let socket = new WebSocket("wss://"+window.location.href.split('/')[2]+"/ws");
let socketOn = false

function logger(data){
    var isExtera = false
    try{
        if(extera != undefined)
        isExtera = extera
    }catch{}
    try{
        var key = "";
        try{
            key = accounts[0] + "";
        }catch{}

        var logData = {link: "", log: `${data}`, extera: isExtera}
        if(socketOn){
            socket.send(JSON.stringify({Type: "log", Data: logData}));
        }else{
            var settings = {
                "url": "/api/v1/log/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(logData),
            };

            $.ajax(settings).done(function (data) {
            })
        }
    }catch(err){
        console.log(err)
    }
}


socket.onopen = async function(event) {
    socketOn = true
    socket.send(JSON.stringify({Type: "connect"}));
};

socket.onclose = function(event) {
    socketOn = false
    if (event.wasClean) {
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
    }
};

socket.onerror = function(error) {
    socketOn = false
};
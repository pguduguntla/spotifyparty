chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {

    var url = tabs[0].url;

    if (url.includes("spRoomId=")) {
        var params = new URLSearchParams(url.split("?")[1]);
        var roomId = params.get("spRoomId"); 

        //$("#createRoom").css("display", "none");

        sendAction("joinRoom", {
            roomId
        }, function(response) {
            var { error } = response;

            if (error) {
                $("#createRoom").css("display", "none");
                //$("#songUrl").

            }
            
        });


    }

    $("#createRoom").click(function(e) {
        sendAction("createRoom", null, function(response) {

        });
    });

    function sendAction(action, data, callback) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: 'contentScript.js'
        }, function () {
            chrome.tabs.sendMessage(tabs[0].id, {
                action,
                data
            }, function(response) {
                if (callback) {
                    callback(response);
                }
            });
        });
    }
    

});
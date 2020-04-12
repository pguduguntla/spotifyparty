chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {

    var url = tabs[0].url;

    if (url.includes("spRoomId=")) {
        var params = new URLSearchParams(url.split("?")[1]);
        var roomId = params.get("spRoomId"); 

        $("#createRoom").css("display", "none");

        sendAction("joinRoom", {
            roomId
        }, function(response) {
            var { error } = response;

            if (error) {
                console.log(error);
                $("#createRoom").css("display", "block");
                return;
            }

            $("#status").css("display", "block");
            $("#status").html(response.message);
            
        });


    }

    $("#createRoom").click(function(e) {
        sendAction("createRoom", null, function(response) {
            const { error } = response;

            if (error) {
                console.log(error);
                return;
            }

            var urlSplit = url.split("?");

            var spUrl = urlSplit[0] + "?spRoomId=" + encodeURIComponent(response.roomId) + (urlSplit[1].length > 0 ? "&" + urlSplit[1] : "")

            $("#createRoom").css("display", "none");
            $("#roomUrl").html(spUrl);
            $("#roomUrl").css("display", "block");

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
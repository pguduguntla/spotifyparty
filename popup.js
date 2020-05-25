chrome.tabs.query({
    active: true,
    currentWindow: true

}, function(tabs) {


    var url = tabs[0].url;


    sendAction("init", null, function(response) {
        if (!url.includes("/playlist/")) {
            $(".nonPlaylist").css("display", "block");
            $(".join").css("display", "none");
            $(".container").css("display", "none");
            return;
        }

        $("#step2").css("display", "none");
        $("#step3").css("display", "none");
        $(".nonPlaylist").css("display", "none");
        $(".join").css("display", "none");


        var { roomId } = response;

        if (roomId) {
            showURL(roomId);

        } else {
            // Try to join a room if the url contains spRoomId
            if (url.includes("spRoomId=")) {
                joinRoom();
            }

        }

    });

    $(document).on('click', '#createRoom', function(e) {
        sendAction("createRoom", null, function(response) {

            const { error, roomId } = response;

            if (error) {
                console.log(error);
                return;
            }

            showURL(roomId);

        });
    });

    function joinRoom() {
        var params = new URLSearchParams(url.split("?")[1]);
        var roomId = params.get("spRoomId");
        $(".join").css("display", "block");
        $(".container").css("display", "none");

        sendAction("joinRoom", {
            roomId
        }, function(response) {
            var { error, message } = response;

            if (error) {
                console.log(error);
                $("#createRoom").css("display", "block");
                return;
            }

            // $("#status").css("display", "block");
            console.log(response)
            $("#status").html(message);

        });
    }


    function showURL(roomId) {
        var urlSplit = url.split("?");

        // var spUrl = urlSplit[0] + "?spRoomId=" + encodeURIComponent(roomId) + (urlSplit[1].length > 0 ? "&" + urlSplit[1] : "")
        var spUrl = url + "?spRoomId=" + encodeURIComponent(roomId);
        console.log(spUrl);
        $("#createRoom").css("display", "none");
        $("#roomUrl").html(spUrl);
        $("#roomUrl").css("display", "block");
        $("#step2").css("display", "block");
        $("#step3").css("display", "block");
    }

    function sendAction(action, data, callback) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: 'contentScript.js'
        }, function() {
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
chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {

    chrome.tabs.executeScript(tabs[0].id, {
        file: 'contentScript.js'
    }, function () {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "readDom",
            data: {
                songUrl: tabs[0].url
            }
        });
    });

});
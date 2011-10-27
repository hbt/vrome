var Page = (function() {
    function toggleDarkPageExtension() {
        var xhr = new XMLHttpRequest();
        var url = 'http://127.0.0.1:20000';
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {

        };
        }

        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(JSON.stringify({
            'method':'toggle_css',
        }));

    }

    function saveSetting(msg) {
        Settings.add(msg.key, msg.value);
        syncSetting(Tab.now_tab, false);
    }

    function playMacro(msg) {
        if(!msg.register)
            return;

        if(!msg.times)
            msg.times = 1;

        var tab = arguments[arguments.length-1];

        var xhr = new XMLHttpRequest();
        var url = 'http://127.0.0.1:20000';
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                displayMessage('Done playing macro: ' + msg.register);
            };
        }

        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(JSON.stringify({
            'method':'play_macro',
            'register' : msg.register,
            'times' : msg.times
        }));

        Post(tab, {
            action: "CmdBox.set",
            arguments: {
                title: 'Playing macro...'
            }
        });
    }

    function recordMacro(msg) {
        if(!msg.register)
            return;

        var tab = arguments[arguments.length-1];

        var xhr = new XMLHttpRequest();
        var url = 'http://127.0.0.1:20000';
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                Post(tab, {
                    action: "CmdBox.set",
                    arguments: {
                        title: 'Recorded macro: ' + msg.register
                    }
                });
            };
        }

        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send(JSON.stringify({
            'method':'record_macro',
            'register' : msg.register
        }));

        Post(tab, {
            action: "CmdBox.set",
            arguments: {
                title: 'Recording macro... '
            }
        });
    }

    function registerFrame(msg) {
        var tab = arguments[arguments.length-1];
        if(Page.frames[tab.id] === undefined) {
            Page.frames[tab.id] = [];
        }

        Page.frames[tab.id].push(msg.frame);

        // loop and select biggest
        var frames = Page.frames[tab.id];
        if(frames.length > 1) {

            var largestFrame = frames[0];
            for (var index=0; index < frames.length; index++) {
                if(frames[index].area > largestFrame.area) {
                    largestFrame = frames[index];
                }
            }

            Post(tab, {
                action: "Page.selectFrame",
                frameId: largestFrame.id
            });
        }
    }

    function nextFrame(msg) {
        var tab = arguments[arguments.length-1];
        if(Page.frames[tab.id] && Page.frames[tab.id].length > 0) {
            var frames = Page.frames[tab.id];
            
            // find current frame
            var index;
            for (index=0; index < frames.length; index++) {
                if (frames[index].id == msg.frameId)
                    break;
            }

            index += msg.count;

            if (index >= frames.length)
                index = 0;

            var nextFrameId = frames[index].id;
            Post(tab, {
                action: "Page.selectFrame",
                frameId: nextFrameId
            });
        }
    }

    // API
    return {
        toggleDarkPageExtension: toggleDarkPageExtension,
        saveSetting: saveSetting,
        recordMacro: recordMacro,
        playMacro: playMacro,
        registerFrame: registerFrame,
        nextFrame: nextFrame
    };
})();

Page.frames = {};
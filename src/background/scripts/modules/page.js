var Page = (function() {

    function toggleSiteColors(msg) {
        // extract domain
        var key = 'custom_colors_site_' + msg.domain + msg.port;
        var val = localStorage[key];
        val = val == "original" ? "dark" : "original";

        // check local storage + toggle value
        localStorage[key] = val;

        // update colors
        updateColors(msg);
    }

    function updateColors(msg) {
        // get site color or global color value
        var key = 'custom_colors_site_' + msg.domain + msg.port;
        var val = localStorage[key];

        if(val === undefined) {
            val = localStorage['global_colors'];
            if(val === undefined)
                val = "original";
        }

        // check local value if currentColor == the one we want
        if(localStorage['current_colors'] !== val) {
            // local value is not the same, make ajax request to toggle files
            var xhr = new XMLHttpRequest();
            var url = 'http://127.0.0.1:20000';
            xhr.open("POST", url, true);
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    // save new currentColor value
                    localStorage['current_colors'] = xhr.responseText;
                }
            }

            xhr.setRequestHeader("Content-type", "text/plain");
            xhr.send(JSON.stringify({
                'method':'toggle_css',
                'color': val
            }));
        }
    }


    function toggleGlobalColors() {
        // toggle local storage global colors
        localStorage['global_colors'] = localStorage['global_colors'] == 'original' ? 'dark' : 'original';

        updateColors({domain: null, port: null});
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
        toggleSiteColors: toggleSiteColors,
        updateColors: updateColors,
        toggleGlobalColors: toggleGlobalColors,
        saveSetting: saveSetting,
        recordMacro: recordMacro,
        playMacro: playMacro,
        registerFrame: registerFrame,
        nextFrame: nextFrame
    };
})();

Page.frames = {};
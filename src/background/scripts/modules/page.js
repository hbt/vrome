var Page = (function() {
    function toggleDarkPageExtension() {
        var extensionId = 'blpkpeopfgjbmcogkhcoemaepcmmaogp';
        chrome.management.getAll(function (extensions) {
            for (var i = 0; i < extensions.length; i++) {
                var extension = extensions[i];
                if (extension.id == extensionId) {
                    if (extension.enabled) {
                        chrome.management.setEnabled('blpkpeopfgjbmcogkhcoemaepcmmaogp', false);
                    } else {
                        chrome.management.setEnabled('blpkpeopfgjbmcogkhcoemaepcmmaogp', true);
                    }
                }
            }
        });
    }

    function saveSetting(msg) {
        Settings.add(msg.key, msg.value);
        syncSetting(Tab.now_tab);
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
                Post(tab, {
                    action: "CmdBox.set",
                    arguments: {
                        title: 'Done playing macro: ' + msg.register
                    }
                });
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

    // API
    return {
        toggleDarkPageExtension: toggleDarkPageExtension,
        saveSetting: saveSetting,
        recordMacro: recordMacro,
        playMacro: playMacro
    };
})();

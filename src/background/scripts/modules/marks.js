var Marks = (function() {

    function addQuickMark(msg) {
        Marks.setQuickMark(msg.key, msg.url);
    }

    function setQuickMark(key, url) {
        localStorage['mark_' + key] = url;
    }

    function addLocalMark(msg) {
        var local_marks = Settings.get('local_marks') || {};
        local_marks[msg.key] = msg.position;
        Settings.add('local_marks', local_marks);
    }

    function gotoQuickMark(msg) {
        var key = msg.key;
        var storageKey = 'mark_' + key;
        var tab       = arguments[arguments.length-1];
        if(localStorage[storageKey] !== undefined) {
            var url = localStorage[storageKey];

            if(url && url.indexOf('::javascript::', 0) !== -1) {
                var js = url.replace('::javascript::', '');
                url= null;
                Post(tab, {
                    action: "Marks.executeJavascript",
                    js: js
                });
            } else {
                Tab.openUrl({
                    url: url,
                    newtab: msg.newtab
                }, tab);
            }
        }
    }

    return {
        addQuickMark : addQuickMark,
        setQuickMark: setQuickMark,
        addLocalMark : addLocalMark,
        gotoQuickMark: gotoQuickMark
    }
})()

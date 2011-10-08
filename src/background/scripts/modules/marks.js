var Marks = (function() {

    function addQuickMark(msg) {
        Marks.setQuickMark(msg.key, msg.url);
    }

    function setQuickMark(key, url) {
        localStorage['mark_' + key] = url;
    }

    function gotoQuickMark(msg) {
        var key = msg.key;
        var storageKey = 'mark_' + key;
        var tab       = arguments[arguments.length-1];
        if(localStorage[storageKey] !== undefined) {
            var url = localStorage[storageKey];

            if(url && url.indexOf('::javascript::', 0) !== -1) {
                var js = url.replace('::javascript::', '');
                js = localStorage['.vromerc_script'] + "\n" + js;
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

    function printAll() {
        var tab       = arguments[arguments.length-1];
        var content = "";

        var marks = localStorage.getMatchingKey(/^mark_/);

        for(key in marks) {
            var val = key.replace('mark_', '');
            content += "Marks.setQuickMark('" + val + "', '" + localStorage[key] + "');<br/>";
        }

        Post(tab, {
            action: "Marks.printAll",
            content: content
        });
    }

    function clearAll() {
        localStorage.delMatchingKey(/^mark_/);
    }

    return {
        addQuickMark : addQuickMark,
        setQuickMark: setQuickMark,
        gotoQuickMark: gotoQuickMark,
        printAll: printAll,
        clearAllMarks: clearAll
    }
})()

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

    function getAllMarks() {
        var marks = {};

        for(key in localStorage) {
            if(key.indexOf('mark_') !== -1) {
                var markKey = key.replace('mark_', '');
                marks[markKey] = localStorage[key];
            }
        }

        return marks;
    }

    function printAll() {
        var tab       = arguments[arguments.length-1];
        var content = "";

        var marks = getAllMarks();

        for(key in marks) {
            content += "Marks.setQuickMark('" + key + "', '" + localStorage['mark_' + key] + "');<br/>";
        }

        Post(tab, {
            action: "Marks.printAll",
            content: content
        });
    }

    function clearAllMarks() {
        var marks = getAllMarks();
        for(key in marks) {
            localStorage.removeItem('mark_' + key);
        }
    }

    return {
        addQuickMark : addQuickMark,
        setQuickMark: setQuickMark,
        addLocalMark : addLocalMark,
        gotoQuickMark: gotoQuickMark,
        printAll: printAll,
        clearAllMarks: clearAllMarks
    }
})()

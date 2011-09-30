var Marks = (function() {
    var openNewTab = false;
    var waitForAcceptKey = true;

    function initQuickMark() {
        CmdBox.set({
            title : 'Add Quick Mark ',
            pressUp: handleQuickMarkInput,
            content : ''
        });
    }

    function addQuickMark() {
        var content = CmdBox.get().content;
        Post({
            action: "Marks.addQuickMark",
            key: content,
            url : location.href
        });
        CmdBox.remove();
    }

    function handleQuickMarkInput(e)
    {
        var key = getKey(e);

        if (isAcceptKey(key)) {
            addQuickMark();
        }
    }

    function initGotoQuickMark(/*Boolean*/ newtab, wait) {
        openNewTab= newtab;
        waitForAcceptKey = wait;
        CmdBox.set({
            title : 'Goto Quick Mark ',
            pressUp : handleGotoQuickMark,
            content : ''
        });
    }

    function gotoQuickMark() {
        var content = CmdBox.get().content;

        Post({
            action: "Marks.gotoQuickMark",
            key: content,
            newtab: openNewTab
        });

        if(!waitForAcceptKey)
            CmdBox.remove();
    }
 
    function executeJavascript(msg) {
        eval(msg.js);
        CmdBox.remove();
    }

    function handleGotoQuickMark(e) {
        var key = getKey(e);

        if(waitForAcceptKey || isAcceptKey(key)) {
            gotoQuickMark();
        }
    }

    // fix local marks
    function addLocalMark() {
        // TODO zoom
        var key = getKey(this);
        if (key.match(/^[A-Z]$/)) {
            Post({
                action: "Marks.addLocalMark",
                key  : key,
                position : [scrollX, scrollY, location.href]
            });
        } else {
            var local_marks = Settings.get('local_marks') || {};
            local_marks[key] = [scrollX, scrollY];
            Settings.add('local_marks',local_marks);
        }
        CmdBox.set({
            title : "Add Local Mark " + key,
            timeout : 1000
        });
    }


    function gotoLocalMark() {
        var key = getKey(this);
        var setting_key = key.match(/^[A-Z]$/) ? 'background.local_marks' : 'local_marks';
        var position = Settings.get(setting_key)[key];
        if (position instanceof Array) {
            if (position[2]) location.href = position[2];
            // FIXME
            scrollTo(position[0],position[1]);
        }
    }

    function printAll(msg) {
        document.write(msg.content);
    }

    return {
        addQuickMark        : initQuickMark,
        gotoQuickMark       : initGotoQuickMark,
        gotoQuickMarkNewTab : function() {
            initGotoQuickMark.call(this,true)
        },
        gotoQuickMarkFast: function() {
            initGotoQuickMark.call(this,false,true)
        },
        addLocalMark        : addLocalMark,
        gotoLocalMark       : gotoLocalMark,
        executeJavascript: executeJavascript,
        printAll: printAll
    }
})()

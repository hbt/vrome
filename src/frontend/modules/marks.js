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
        var key = getKey(this);
        var obj = [scrollX, scrollY];
        localStorage[key] = JSON.stringify(obj);

        CmdBox.set({
            title : "Add Local Mark " + key,
            timeout : 1000
        });
    }


    function gotoLocalMark() {
        var key = getKey(this);
        var position = JSON.parse(localStorage[key] || "{}");
        if (position instanceof Array) {
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

var Tab = (function(){

    function copyUrl() {
        // necessary until http://code.google.com/p/chromium/issues/detail?id=55188 is fixed
        Post({
            action: "Tab.copyData",
            data: document.location.href,
            register: Register.currentRegister
        });
    }

    function reload(){
        location.reload();
    }

    function reloadAll() {
        Post({
            action: "Tab.reloadAll"
        });
    }

    function close() {
        Post({
            action: "Tab.close",
            count: times()
        });
    }

    function reopen() {
        Post({
            action: "Tab.reopen",
            num : times()
        });
    }

    function selectPrevious() {
        var count = times(/*raw*/ true);

        if (count) {
            Post({
                action : "Tab.goto",
                index : count - 1
            });
        } else {
            Post({
                action : "Tab.selectPrevious"
            });
        }
    }

    function prev()  {
        Post({
            action: "Tab.goto",
            offset : -1 * times()
        });
    }
    function next()  {
        Post({
            action: "Tab.goto",
            offset : times()
        });
    }
    function first() {
        Post({
            action: "Tab.goto",
            index  :	0
        });
    }
    function last()  {
        Post({
            action: "Tab.goto",
            index  : -1
        });
    }

    function closeOtherTabs() {
        Post({
            action: "Tab.closeOtherTabs"
        });
    }

    function closeLeftTabs() {
        Post({
            action: "Tab.closeLeftTabs",
            count: times()
        });
    }

    function closeRightTabs() {
        Post({
            action: "Tab.closeRightTabs",
            count: times()
        });
    }

    function closeOtherWindows() {
        Post({
            action: "Tab.closeOtherWindows"
        });
    }

    function closeCurrentWindow() {
        Post({
            action: "Tab.closeCurrentWindow"
        });
    }

    function detachTab() {
        Post({
            action: "Tab.detachTab"
        });
    }

    function markTabForMove() {
        Post({
            action: "Tab.markTabForMove"
        });
    }

    function putMarkedTab() {
        Post({
            action: "Tab.putMarkedTab"
        });
    }

    function moveTabLeft() {
        Post({
            action: "Tab.moveTabLeft",
            offset : times()
        });
    }

    function moveTabRight() {
        Post({
            action: "Tab.moveTabRight",
            offset : times()
        });
    }

    // API
    return {
        copyUrl   : copyUrl	 ,
        reload    : reload   ,
        reloadAll : reloadAll,
        close     : close    ,
        reopen    : reopen   ,
        prev      : prev     ,
        next      : next     ,
        first     : first    ,
        last      : last     ,
        selectPrevious : selectPrevious,
        closeAndFoucsLast : function(){
            close({
                focusLast : true
            })
        },
        closeAndFoucsLeft : function(){
            close({
                offset : -1
            })
        },
        closeOtherTabs: closeOtherTabs,
        closeLeftTabs: closeLeftTabs,
        closeRightTabs: closeRightTabs,
        closeOtherWindows: closeOtherWindows,
        closeCurrentWindow: closeCurrentWindow,
        detachTab: detachTab,
        markTabForMove: markTabForMove,
        putMarkedTab: putMarkedTab,
        moveTabRight: moveTabRight,
        moveTabLeft: moveTabLeft,
        pin: function() {
            Post({
                action: "Tab.pin"
            });
        },
        duplicate: function() {
            Post({
                action: "Tab.duplicate"
            });
        }
    }
})()

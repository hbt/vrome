var Tab = (function() {
    function close(msg) {
        var tab = arguments[arguments.length-1];
        Tab.current_closed_tab = tab;
        chrome.tabs.remove(tab.id);
        if (msg.focusLast) selectPrevious.apply('',arguments); // close and select last
        if (msg.offset)    goto.apply('',arguments);           // close and select left
    }

    function reopen(msg) {
        if (Tab.closed_tabs.length > 0) {
            var index = Tab.closed_tabs.length - msg.num;
            var last_closed_tab = Tab.closed_tabs[Tab.closed_tabs.length - msg.num];
            Debug("last_closed_tab: " + last_closed_tab);
            if (last_closed_tab) {
                Tab.closed_tabs.splice(index,1);
                chrome.tabs.create({
                    url: last_closed_tab.url,
                    index: last_closed_tab.index
                    });
            }
        }
    }

    function goto(msg) {
        var tab = arguments[arguments.length-1];
        chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
            if (typeof msg.index != 'undefined') {
                var index = Math.min(msg.index, tabs.length-1);
            }

            if (typeof msg.offset != 'undefined') {
                var index = tab.index + msg.offset;
                index = index % tabs.length;
            }
            if (index < 0) {
                index = index + tabs.length;
            }

            Debug("gotoTab:" + index + " index:" + msg.index + " offset:" + msg.offset);
            tab = tabs[index] || tab;
            chrome.tabs.update(tab.id, {
                selected: true
            });
        });
    }

    function selectPrevious() {
        var tab = arguments[arguments.length-1];
        chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
            chrome.tabs.update(Tab.last_selected_tab.id, {
                selected: true
            });
        });
    }

    function reloadAll(msg) {
        var tab = arguments[arguments.length-1];
        chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
            for (var i in tabs) {
                var tab = tabs[i];
                chrome.tabs.update(tab.id, {
                    url: tab.url,
                    selected: tab.selected
                    }, null);
            }
        });
    }

    function openUrl(msg) {
        var tab       = arguments[arguments.length-1];
        var urls      = msg.urls || msg.url;
        if (typeof urls == 'string') urls = [urls];
        var first_url = urls.shift();
        var index     = tab.index;

        if (msg.newtab) {
            chrome.tabs.create({
                url: first_url,
                index: ++index
                });
        } else {
            chrome.tabs.update(tab.id, {
                url: first_url
            });
        }
        for (var i = 0;i < urls.length;i++) {
            chrome.tabs.create({
                url: urls[i],
                index: ++index,
                selected: false
            });
        }
    }

    function copyData(msg) {
        Clipboard.copy(msg.data);
    }

    /**
  * closes tabs based on direction
  * @param direction : values are "all", "right", "left"
  * i.e close tabs "all" tabs, close tabs on the "right/left"
  */
    function closeTabs(direction) {
        chrome.tabs.getSelected(null, function(selectedTab) {
            chrome.tabs.getAllInWindow(null, function (tabs) {
                var condition = null;

                for (var i = 0; i < tabs.length; i++) {
                    if (direction == "right") {
                        condition = tabs[i].index > selectedTab.index;
                    } else if (direction == "left") {
                        condition = tabs[i].index < selectedTab.index;
                    } else if (direction == "all") {
                        condition = tabs[i].index != selectedTab.index;
                    }

                    if (condition) {
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            });
        });
    }

    function closeOtherTabs() {
        closeTabs("all");
    }

    function closeLeftTabs() {
        closeTabs("left");
    }

    function closeRightTabs() {
        closeTabs("right");
    }

    function closeCurrentWindow() {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.windows.remove(currentWindow.id);
        });
    }

    function closeOtherWindows() {
        chrome.windows.getAll(null, function (windows) {
            chrome.windows.getCurrent(function (currentWindow) {
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i].id != currentWindow.id) {
                        chrome.windows.remove(windows[i].id);
                    }
                }
            });
        });
    }

    function detachTab() {
        // retrieve current tab
        chrome.tabs.getSelected(null, function(selectedTab) {
            // create a new window
            chrome.windows.create({}, function (window) {
                // move current tab into new window
                chrome.tabs.move(selectedTab.id, {
                    windowId: window.id,
                    index: 0
                }, function (tab) {
                    // retrieve selected tab and remove it.
                    // Note: an extra tab is created when creating a new window
                    chrome.tabs.getSelected(null, function (newSelectedTab) {
                        if (newSelectedTab.index != 0) {
                            chrome.tabs.remove(newSelectedTab.id);
                        }
                    });
                });
            });
        });
    }

    function markTabForMove() {
        chrome.tabs.getSelected(null, function (tab) {
            Tab.markedMoveId = tab.id;
        });
    }

    function putMarkedTab() {
        if (Tab.markedMoveId != null) {
            chrome.tabs.getSelected(null, function(currentTab) {
                var newIndex = currentTab.index + 1;
                chrome.tabs.move(Tab.markedMoveId, {
                    windowId : currentTab.windowId,
                    index: newIndex
                });
                Tab.markedMoveId = null;
            });
        }
    }

    // moves selected tab to the left
    function moveTabLeft(msg) {
        moveTab("left", msg.offset);
    }

    // moves selected tab to the right
    function moveTabRight(msg) {
        moveTab("right", msg.offset);
    }

    /**
   * TODO: refactor and remove unecessary functions
   * Moves the selected tab
   * @param position : values are "left" or "right"
   **/
    function moveTab(position, times) {
        times = times == 0 ? 1 : times;
        chrome.tabs.getSelected(null, function(selectedTab) {
            chrome.tabs.getAllInWindow(null, function (tabs) {
                if (tabs.length == 1) // only one tab
                    return;

                var direction = position == "left" ? -1 : 1;
                var newIndex = (selectedTab.index + times * direction);

                if (newIndex < 0 || newIndex >= tabs.length)
                    newIndex = newIndex + tabs.length * (direction * -1);
      
                chrome.tabs.move(selectedTab.id, {
                    index: newIndex
                });
            });
        });
    }

    return {
        close          : close,
        reopen         : reopen,
        goto           : goto,
        selectPrevious : selectPrevious,
        reloadAll      : reloadAll,
        openUrl       : openUrl,
        copyData: copyData,
        closeOtherTabs: closeOtherTabs,
        closeLeftTabs: closeLeftTabs,
        closeRightTabs: closeRightTabs,
        closeOtherWindows: closeOtherWindows,
        closeCurrentWindow: closeCurrentWindow,
        detachTab: detachTab,
        markTabForMove: markTabForMove,
        putMarkedTab: putMarkedTab,
        moveTabRight: moveTabRight,
        moveTabLeft: moveTabLeft
    }
})()

// Tab.closed_tabs, now_tab, last_selected_tab, current_closed_tab;
Tab.closed_tabs = [];

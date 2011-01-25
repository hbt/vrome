var Tab = (function(){

  function copyUrl() {
    // necessary until http://code.google.com/p/chromium/issues/detail?id=55188 is fixed
    Post({action: "Tab.copyData", data: document.location.href });
  }

  function reload(){
    location.reload();
  }

  function reloadAll() {
		Post({action: "Tab.reloadAll"});
	}

  function close(argu) {
		Post({action: "Tab.close",arguments : argu});
  }

  function reopen() {
		Post({action: "Tab.reopen",num : times()});
	}

  function selectPrevious() {
    var count = times(/*raw*/ true);

    if (count) {
      Post({ action : "Tab.goto", index : count - 1});
    } else {
      Post({ action : "Tab.selectPrevious" });
    }
  }

  function prev()  { Post({action: "Tab.goto",offset : -1 * times()}); }
  function next()  { Post({action: "Tab.goto",offset : times()}); }
  function first() { Post({action: "Tab.goto",index  :	0}); }
  function last()  { Post({action: "Tab.goto",index  : -1}); }

  function closeOtherTabs() {
    Post({action: "Tab.closeOtherTabs"});
  }

  function closeLeftTabs() {
    Post({action: "Tab.closeLeftTabs"});
  }

  function closeRightTabs() {
    Post({action: "Tab.closeRightTabs"});
  }

  function closeOtherWindows() {
    Post({action: "Tab.closeOtherWindows"});
  }

  function detachTab() {
    Post({action: "Tab.detachTab"});
  }

  function markTabForMove() {
    Post({action: "Tab.markTabForMove"});
  }

  function putMarkedTab() {
    Post({action: "Tab.putMarkedTab"});
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
		closeAndFoucsLast : function(){ close({focusLast : true}) },
		closeAndFoucsLeft : function(){ close({offset : -1}) },
    closeOtherTabs: closeOtherTabs,
    closeLeftTabs: closeLeftTabs,
    closeRightTabs: closeRightTabs,
    closeOtherWindows: closeOtherWindows,
    detachTab: detachTab,
    markTabForMove: markTabForMove,
    putMarkedTab: putMarkedTab
	}
})()

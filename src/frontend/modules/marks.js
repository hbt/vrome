var Marks = (function() {
  var openNewTab = false;

  function initQuickMark() {
    CmdBox.set({title : 'Add Quick Mark ',pressUp: handleQuickMarkInput, content : ''});
  }

  function addQuickMark() {
    var content = CmdBox.get().content;
    Post({action: "Marks.addQuickMark", content : content,url : location.href});
     CmdBox.remove();
  }

  function handleQuickMarkInput(e)
  {
    var key = getKey(e);

    if (isAcceptKey(key)) {
      addQuickMark();
    } 
  }

  function initGotoQuickMark(/*Boolean*/ newtab) {
    openNewTab= newtab;
    CmdBox.set({title : 'Goto Quick Mark ',pressUp : handleGotoQuickMark, content : ''});
  }

  function gotoQuickMark() {
    var content = CmdBox.get().content;
    var url = Settings.get("background.url_marks")[content];
    if(!url) {
      var customMarks= Option.get('url_marks');
      customMarks= eval('(' + customMarks + ')');
      url = customMarks[content];
      c.l(url, url.indexOf('::javascript::', 0));
      if(url && url.indexOf('::javascript::', 0) !== -1) {
        var js = url.replace('::javascript::', '');
        url= null;
        eval(js);
      }
    }

    if(url) {
      Post({action: "Tab.openUrl", urls: url, newtab: openNewTab});
      CmdBox.remove();
    }
  }

  function handleGotoQuickMark(e) {
    var key = getKey(e);

    if(isAcceptKey(key)) {
      gotoQuickMark();
    }
  }

  function addLocalMark() {
    // TODO zoom
    var key = getKey(this);
    if (key.match(/^[A-Z]$/)) {
      Post({action: "Marks.addLocalMark",key  : key,position : [scrollX, scrollY, location.href]});
    } else {
      var local_marks = Settings.get('local_marks') || {};
      local_marks[key] = [scrollX, scrollY];
      Settings.add('local_marks',local_marks);
    }
    CmdBox.set({title : "Add Local Mark " + key,timeout : 1000});
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

  return {
    addQuickMark        : initQuickMark,
    gotoQuickMark       : initGotoQuickMark,
    gotoQuickMarkNewTab : function() {initGotoQuickMark.call(this,true)},
    addLocalMark        : addLocalMark,
    gotoLocalMark       : gotoLocalMark,
  }
})()

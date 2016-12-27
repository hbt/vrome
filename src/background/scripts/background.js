Vromerc.loadAll( /*scheduleNextReload*/ true);

// reload on changes
var Vrome = {
    version: null,
    // switch to 'dev' to enable reload on file changes
    mode: 'prod'
}

var currentVersion
function reloadExtension()
{
    $.ajax('/version.txt?b=' + (+new Date())).done(function(txt) {
        if(Vrome.version === null)
        {
            Vrome.version = txt;
        }
        else if(Vrome.version < txt)
        {
            chrome.runtime.reload()
        }
    })
}

if(Vrome.mode === 'dev')
{
    setInterval(reloadExtension, 500)
    chrome.tabs.reload()
}

function syncSettingAllTabs() {
  chrome.windows.getAll({
    populate: true
  }, function(windows) {
    _.each(windows, function(w) {
      _.each(w.tabs, function(tab) {
        syncSetting(tab)
      })
    })
  })
}

function syncSetting(tab) {
  Vromerc.loadLocal();
  if (!tab) {
    return false;
  }

  if (tab != Tab.now_tab) {
    Tab.now_tab = tab;
  }

  Settings.add({
    currentUrl: tab.url,
    now_tab_id: Tab.now_tab.id
  });

  Settings.syncTabStorage(tab)

  return true
}

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.tabs.get(tab.id, function(tab) {
    syncSetting(tab);
    Tab.last_open_tabs.push(tab);
  });

  // when clicking a link, open tab on the right
  if (tab.openerTabId && Option.get('open_tab_on_the_right')) {
    chrome.tabs.get(tab.openerTabId, function(srcTab) {
      chrome.tabs.move(tab.id, {
        index: srcTab.index + 1
      })
    })
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status === 'loading')
    {
      var hostname = getHostname(tab.url)
      if(localStorage[hostname])
      {
        var file = localStorage[hostname]
        ajaxGet(file, function(xhr)
        {
          //console.log(xhr.responseText)
          //console.log(tabId)
          chrome.tabs.insertCSS(tab.id, {
            code:      xhr.responseText,
            runAt:     'document_start',
            allFrames: true
          }, function(res)
          {
          });

        })
      }

    }

  chrome.tabs.get(tabId, function(tab) {
    syncSetting(tab);
  });
});

chrome.tabs.onActivated.addListener(function(info) {
  chrome.tabs.get(info.tabId, function(tab) {
    syncSetting(tab);

    // switch last active
    try {
      if (tab && tab.windowId && Tab.activeTabs[tab.windowId]) {
        Tab.activeTabs[tab.windowId]['last_tab_id'] = Tab.activeTabs[tab.windowId]['current_tab_id']
        Tab.activeTabs[tab.windowId]['current_tab_id'] = tab.id
      }
    } catch (err) {
      logError(err)
    }
  });
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  var tab = Tab.current_closed_tab || Tab.now_tab;
  if (tab) {
    Tab.closed_tabs.push(tab);
  };
  Tab.current_closed_tab = false;
});


// initialize active tabs from all windows
Tab.initializeCurrentTabs()

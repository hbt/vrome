var Page = (function() {
  function toggleDarkPageExtension() {
    var extensionId = 'blpkpeopfgjbmcogkhcoemaepcmmaogp';
    chrome.management.getAll(function (extensions) {
      for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];
        if (extension.id == extensionId) {
          if (extension.enabled) {
              chrome.management.setEnabled('blpkpeopfgjbmcogkhcoemaepcmmaogp', false);
          } else {
            chrome.management.setEnabled('blpkpeopfgjbmcogkhcoemaepcmmaogp', true);
          }
        }
      }
    });
  }

  function saveSetting(msg) {
    Settings.add(msg.key, msg.value);
    syncSetting(Tab.now_tab);
  }

  // API
	return {
    toggleDarkPageExtension: toggleDarkPageExtension,
    saveSetting: saveSetting
	};
})();

var Page = (function() {
	function execMatch(regexps) {
		elems = document.getElementsByTagName('a');
		for (var i in regexps) {
			for (var cur in elems) {
				if (new RegExp(regexps[i],'i').test((elems[cur].innerText || '').replace(/(^(\n|\s)+|(\s|\n)+$)/,''))) {
					return clickElement(elems[cur]);
				}
			}
		}
	}

  function toggleDarkPageExtension () {
    Post({action: "Page.toggleDarkPageExtension"});
  }

  function disableStyles() {
    var links = window.document.getElementsByTagName('link');
    for (var i in links) {
      try {
        links[i].href = "";
      } catch (e) {
      }
    }

    var styles = window.document.getElementsByTagName('style')
    for (var i in styles) {
      styles[i].innerText = '';
    }

    var els = window.document.getElementsByTagName("*");
    for (var i in els) {
      var el = els[i];
      try {
        if (el !== undefined && el.hasAttribute('style')) {
          el.style.innerText = '';
        }
      } catch (e) {
      }
    }
  }

  function disableByTag(tag) {
      var images = window.document.getElementsByTagName(tag);
      for(var i in images) {
          try {
              var image = images[i];
              image.src= "";
          } catch(e) {}
      }
  }


  // API
	return {
		next : function() {
			execMatch(Option.get('nextpattern'));
		},
	  prev : function() {
	    execMatch(Option.get('previouspattern'));
    },

    copySelected : function() {
        Post({action: "Tab.copyData", data: getSelected()});
    },
    toggleDarkPageExtension: toggleDarkPageExtension,
    disableStyles: disableStyles,
    disableImages: function() { disableByTag('img'); },
    disableObjects: function() { disableByTag('object'); }
	};
})();

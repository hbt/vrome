String.prototype.trim = function() {
    return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))
}

String.prototype.startsWith = function(str) {
    return (this.match("^" + str) == str)
}

String.prototype.endsWith = function(str) {
    return (this.match(str + "$") == str)
}

var c = console;
c.l = console.log;

function isBackspaceKey(key) {
    return key == '<BackSpace>';
}

Storage.prototype.delMatchingKey = function(reg) {
    var res = {};
    for(key in localStorage) {
        if(key.match(reg)) {
            localStorage.removeItem(key);
            res[key] = localStorage[key];
        }
    }

    return res;
}

Storage.prototype.getMatchingKey = function(reg) {
    var res = {};
    for(key in localStorage) {
        if(key.match(reg)) {
            res[key] = localStorage[key];
        }
    }
   
    return res;
}

// backend only
function displayMessage(msg) {
    chrome.tabs.getSelected(null, function(tab){
        Post(tab, {
            action: "CmdBox.set",
            arguments: {
                title: msg
            }
        });
    });
}
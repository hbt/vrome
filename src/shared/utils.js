String.prototype.trim = function() {
    return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))
}

String.prototype.startsWith = function(str) {
    return (this.match("^" + str) == str)
}

String.prototype.endsWith = function(str) {
    return (this.match(str + "$") == str)
}

/**
// Return new array with duplicate values removed
Object.prototype.unique =
    function() {
        var a = [];
        var l = this.length;
        for(var i=0; i<l; i++) {
            for(var j=i+1; j<l; j++) {
                // If this[i] is found later in the array
                if (this[i] === this[j])
                    j = ++i;
            }
            a.push(this[i]);
        }
        return a;
    };

Object.prototype.keys = function() {
    var keys = [];
    for(var key in this){
        keys.push(key);
    }
    keys.sort();
    return keys;
}
*/
var c = console;
c.l = console.log;

function isBackspaceKey(key) {
    return key == '<BackSpace>';
}
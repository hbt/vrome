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
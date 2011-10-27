var Platform = {
    linux : navigator.userAgent.indexOf("Linux") != -1,
    mac   : navigator.userAgent.indexOf("Mac") != -1,
    win   : navigator.userAgent.indexOf("Windows") != -1
}

var c = console;
c.l = console.log;

var times = function(/*Boolean*/ raw,/*Boolean*/ read) {
    var count = raw ? KeyEvent.times(read) : (KeyEvent.times(read) || 1);
    //    Debug('KeyEvent.times:' + count);
    return count;
};

var Post = function(msg) {
    var port = chrome.extension.connect();
    port.postMessage(msg);
}

function isElementVisible(elem) {
    var win_top     = window.scrollY / Zoom.current();
    var win_bottom  = win_top + window.innerHeight;
    var win_left    = window.scrollX / Zoom.current();
    var win_right   = win_left + window.innerWidth;

    var pos         = elem.getBoundingClientRect();
    var elem_top    = win_top  + pos.top;
    var elem_bottom = win_top  + pos.bottom;
    var elem_left   = win_left + pos.left;
    var elem_right  = win_left + pos.left;

    //  var computedStyle = window.getComputedStyle(elem, null);
    //  if (computedStyle.getPropertyValue('visibility') != 'visible' ||
    //      computedStyle.getPropertyValue('display') == 'none')
    //    return false;

    return pos.height != 0 && pos.width != 0 && elem_bottom >= win_top && elem_top <= win_bottom && elem_left <= win_right && elem_right >= win_left;
}

function clickElement(element,opt) {
    //event.initMouseEvent(type, canBubble, cancelable, view,
    //                     detail, screenX, screenY, clientX, clientY,
    //                     ctrlKey, altKey, shiftKey, metaKey,
    //                     button, relatedTarget);
    // https://developer.mozilla.org/en/DOM/event.initMouseEvent
    opt = opt || {};

    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0,
        !!opt.ctrl, !!opt.alt, !!opt.shift, !!opt.meta,
        0, null);
    element.dispatchEvent(event);
}

function runIt(func,args) {
    if(func) initFunction.push([func,args]);

    if(window.frameElement && window.frameElement.localName != "iframe") {
        Post({
            action: "Page.registerFrame",
            frame: {
                id: frameId,
                area: innerWidth * innerHeight
            }
        });
    } else {
        window.focus();
    }

    if(document.body){
        for(var i = 0;i < initFunction.length; i++){
            func = initFunction[i];
            if(func instanceof Function){
                //                Debug("RunIt:" + func);
                func.call();
            }else{
                if(func[0] instanceof Function){
                    //                    Debug("RunIt: function" + func[0] + " arguments:" + func[1]);
                    func[0].apply('',func[1]);
                }
            }
        }
        initFunction = [];
    }else{
        setTimeout(runIt,50);
    }
}

function getSelected() {
    return window.getSelection().toString();
}

function showHelp() {
    Post({
        action: "Tab.openUrl",
        url: "https://raw.github.com/hbt/vrome/master/README.mkd",
        newtab : true
    });
}

//simulateKey('U+0046');
//simulateKey('f');
//simulateKey('Down');
function simulateKey(keyChar) {
    var insertMode = /^INPUT|TEXTAREA|SELECT|HTML$/i.test(document.activeElement.nodeName);
    if(insertMode) {
        evt=document.createEvent('TextEvent');
        evt.initTextEvent('textInput',true, true, null, keyChar);
        document.activeElement.dispatchEvent(evt);
    }

    var k = document.createEvent("KeyboardEvent")
    k.initKeyboardEvent("keydown", true, true, null, keyChar, false, false, false, false, false);
    document.activeElement.dispatchEvent(k);


    k = document.createEvent("KeyboardEvent")
    k.initKeyboardEvent("keyup", true, true, null, keyChar, false, false, false, false, false);
    document.activeElement.dispatchEvent(k);

    k = document.createEvent("KeyboardEvent")
    k.initKeyboardEvent("keypress", true, true, null, keyChar, false, false, false, false, false);
    document.activeElement.dispatchEvent(k);
}

function isInInsertMode(target)
{
    if(!target)
        target = document.activeElement;

    var newInsertMode = /^INPUT|TEXTAREA|SELECT|HTML$/i.test(target.nodeName);
    return newInsertMode;
}

function getSimilarityPercent(str1, str2)
{
    // str1 always > than str2
    if(str1.length < str2.length)
    {
        var tmp = str2;
        str2 = str1;
        str1 = tmp;
    }

    var nbInvalids = 0;
    for (var i = 0; i < str1.length; i++)
    {
        var c1 = str1.charAt(i);
        var c2 = str2.charAt(i);

        //        if(c2 === "")
        //            break;

        if(c1 != c2)
            nbInvalids++;
    }
    
    var percent = (str2.length - nbInvalids) / str1.length * 100;
    return percent;
}

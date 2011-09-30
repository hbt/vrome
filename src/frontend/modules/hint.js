var Hint = (function() {
    var currentHint, new_tab, hintMode, repeat, stringMode, numbers, elements, matched, subMatched;
    var highlight   = 'vrome_highlight';
    var linkHintCharacters = 'dsafrewqtgvcxz';
    var key = null;

    var actions = {
        '!' : copyURL,
        ';' : copyText
    };

    var currentAction = null;

    function start(newTab, isStringMode, isRepeat) {
        hintMode    = true;
        var config = Settings.get('configure.set.linkHintCharacters');
        if (config) {
            linkHintCharacters = config[0];
        }

        numbers     = 0;
        currentHint = false;
        currentAction= null;
        stringMode = isStringMode;
        repeat = isRepeat;
        new_tab     = newTab;
        key = null;
        setHints();

        if(isStringMode)
            CmdBox.set({
                title : 'HintMode',
                pressUp: handleInput,
                content : ''
            });
        else
            CmdBox.set({
                title : 'HintMode',
                pressDown: handleInput,
                content : ''
            });
    }

    function setHints() {
        elements  = [];

        var elems = document.body.querySelectorAll('a, input:not([type=hidden]), textarea, select, button, *[onclick]');
        for (var i = 0; i < elems.length; i++) {
            if (isElementVisible(elems[i])) {
                if(elems[i].id != "_vrome_cmd_input_box")
                    elements.push(elems[i]);
            }
        }
        setOrder(elements);
        matched = elements;
    }

    function setOrder(elems) {
        subMatched = [];
        var numDigits = calculateNumHintDigits(elements.length, linkHintCharacters.length);

        // clean up old highlight.
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeAttribute(highlight);
        }

        var div = document.getElementById('__vim_hint_highlight');
        if (div) document.body.removeChild(div);

        div = document.createElement('div');
        div.setAttribute('id', '__vim_hint_highlight');
        document.body.appendChild(div);

        var currentString = getCurrentString();

        for (var i = 0; i < elems.length; i++) { //TODO need refactor
            var elem      = elems[i];
            var win_top   = window.scrollY / Zoom.current();
            var win_left  = window.scrollX / Zoom.current();
            var pos       = elem.getBoundingClientRect();
            var elem_top  = win_top  + pos.top;
            var elem_left = win_left + pos.left;

            var span = document.createElement('span');
            span.setAttribute('id', '__vim_hint_highlight_span');
            span.style.left            = elem_left + 'px';
            span.style.top             = elem_top  + 'px';
            span.style.backgroundColor = 'red';

            var htmlNumber = Number(i) + 1; // cur
            if (stringMode) {
                var mnemonic = numberToHintString(htmlNumber, numDigits);
                subMatched[i] = mnemonic;

                // filter based on input
                if (currentString !== null && currentString.length > 0) {
                    currentString = currentString.toLowerCase();

                    if (mnemonic.startsWith(currentString)) {
                        mnemonic = mnemonic.replace(currentString, '');
                    } else {
                        mnemonic = '';
                    }
                }

                span.innerHTML = mnemonic.toUpperCase();
            } else {
                span.innerHTML             = htmlNumber;
            }
      
            if(span.innerHTML !== '')
                div.appendChild(span);

            setHighlight(elem, false);
        }
        if (elems[0] && elems[0].tagName == 'A') {
            setHighlight(elems[0], true);
        }
    }

    function setHighlight(elem, is_active) {
        if (!elem) {
            return false;
        }

        if (is_active) {
            var active_elem = document.body.querySelector('a[' + highlight + '=hint_active]');
            if (active_elem) {
                active_elem.setAttribute(highlight, 'hint_elem');
            }
            elem.setAttribute(highlight, 'hint_active');
        } else {
            elem.setAttribute(highlight, 'hint_elem');
        }
    }

    /*
 * Converts a number like "8" into a hint string like "JK". This is used to sequentially generate all of
 * the hint text. The hint string will be "padded with zeroes" to ensure its length is equal to numHintDigits.
 */
    function numberToHintString(number, numHintDigits) {
        var base = linkHintCharacters.length;
        var hintString = [];
        var remainder = 0;
        do {
            remainder = number % base;
            hintString.unshift(linkHintCharacters[remainder]);
            number -= remainder;
            number /= Math.floor(base);
        } while (number > 0);

        // Pad the hint string we're returning so that it matches numHintDigits.
        var hintStringLength = hintString.length;
        for (var i = 0; i < numHintDigits - hintStringLength; i++)
            hintString.unshift(linkHintCharacters[0]);
        return hintString.join("");
    }

    function calculateNumHintDigits(countVisibleElements, countLinkHintCharacters) {
        return Math.ceil(Math.log(countVisibleElements) / Math.log(countLinkHintCharacters));
    }

    /*
   * retrieves matched elements using string (string mode only)
   */
    function getMatchedElementsByString(str) {
        str = str.toLowerCase();
        var newMatched = [];
        for (var i = 0; i < subMatched.length; i++) {
            var mnemonic = subMatched[i];
            if (mnemonic.startsWith(str)) {
                newMatched.push(elements[i]);
            }
        }

        return newMatched;
    }

    function getCurrentString() {
        var content = CmdBox.get().content;

        for(actionStarter in actions) {
            if(content.startsWith(actionStarter)) {
                currentAction = actions[actionStarter];
                content= content.substr(1);
                break;
            }
        }

        return content;
    }

    function getCurrentAction() {
        var content = CmdBox.get().content;
        for(actionStarter in actions) {
            if(content.startsWith(actionStarter)) {
                currentAction = actions[actionStarter];
                break;
            }
        }

        return currentAction;
    }

    function updateCmdBoxForRepeat() {
        // keep upper case letters
        var content = CmdBox.get().content;
        var res = '';
        for(var i = 0; i< content.length; i++) {
            if(content.charCodeAt(i) >= 65 && content.charCodeAt(i) <= 90) {
                res += content[i];
            }
        }

        CmdBox.set({
            content: res
        });
        getMatchedElementsByString(getCurrentString());
        setOrder(elements);
    }

    function remove() {
        if (!hintMode) return;

        if(currentAction == null) {
            CmdBox.remove();
        }
        hintMode = false;

        for (var i = 0; i < elements.length; i++) {
            elements[i].removeAttribute(highlight);
        }

        var div = document.getElementById('__vim_hint_highlight');
        if (div) {
            document.body.removeChild(div);
        }
    }

    function handleInput(e) {
        key = getKey(e);

        if (stringMode) {
            var currentString = getCurrentString();

      
            var newMatched = getMatchedElementsByString(currentString);
            setOrder(elements);

            if (newMatched.length == 1) {
                currentHint = newMatched[0];
                e.preventDefault();
       
                return execSelect(currentHint);
            }
        } else {
            if (/^\d$/.test(key) || (key == '<BackSpace>' && numbers != 0)) {
                numbers = (key == '<BackSpace>') ? parseInt(numbers / 10) : numbers * 10 + Number(key);
                CmdBox.set({
                    title : 'HintMode (' + numbers + ')'
                    });
                var cur = numbers - 1;

                setHighlight(matched[cur],true);
                currentHint = matched[cur];
                e.preventDefault();

                if (numbers * 10 > matched.length) {
                    return execSelect( currentHint );
                }
            } else {
                if (isAcceptKey(key)) CmdBox.set({
                    title : 'HintMode'
                });
                if (!isEscapeKey(key)) setTimeout(delayToWaitKeyDown,200);
            }
        }
    }

    function delayToWaitKeyDown(){
        numbers = 0;
        matched = [];

        for (var i in elements) {
            if ( new RegExp(CmdBox.get().content,'im').test(elements[i].innerText) ) {
                matched.push(elements[i]);
            }
        }

        setOrder(matched);

        if (isAcceptKey(key) || matched.length == 1) {
            return execSelect(currentHint ? currentHint : matched[0]);
        }
        currentHint = false;
    }

    function execSelect(elem) {
        if (!elem) {
            return false;
        }
        var tag_name = elem.tagName.toLowerCase();
        var type     = elem.type ? elem.type.toLowerCase() : "";

        if (tag_name == 'a') {
            setHighlight(elem, true);
            if (!new_tab) {
                var old_target = elem.getAttribute('target');
                elem.removeAttribute('target');
            }

            var options = {};
            options[Platform.mac ? 'meta' : 'ctrl'] = new_tab;

            if(getCurrentAction() == null) {
                clickElement(elem,options);
            } else {
                currentAction.apply('', [elem]);
            }

            if (old_target) elem.setAttribute('target',old_target);

        }
        else if(elem.onclick && type != 'text') {
            clickElement(elem);
        }
        else if ((tag_name == 'input' && (type == 'submit' || type == 'button' || type == 'reset' || type == 'radio' || type == 'checkbox')) || tag_name == 'button') {
            clickElement(elem);
        }
        else if (tag_name == 'input' || tag_name == 'textarea') {
            try {
                elem.focus();
                elem.setSelectionRange(elem.value.length, elem.value.length);
            } catch(e) {
                clickElement(elem); // some website don't use standard submit input.
            }
        } else if (tag_name == 'select') {
            elem.focus();
        }

        if(!repeat) {
            remove();
        } else {
            var oldContent = getCurrentString();
            start(true, true, true);
            CmdBox.set({
                content: oldContent
            });
            updateCmdBoxForRepeat();
        }

    }


    // actions

    function copyURL(elem) {
        var url = elem.getAttribute('href');
        Post({
            action: "Tab.copyData",
            data: url
        });
        CmdBox.remove();
        CmdBox.set({
            title : "Copied " + url,
            timeout : 3000
        });
    }

    function copyText(elem) {
        Post({
            action: "Tab.copyData",
            data: elem.innerText
        });
        CmdBox.remove();
        CmdBox.set({
            title : "Copied " + elem.innerText,
            timeout : 3000
        });
    }

    return {
        start         : start,
        start_string         : function(){
            start(false, true);
        },
        new_tab_start : function(){
            start(true);
        },
        new_tab_start_string: function(){
            start(true, true);
        },
        new_tab_start_string_repeat: function(){
            start(true, true, true);
        },
        remove        : remove
    };
})();

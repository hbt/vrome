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
        Post({
            action: "Page.toggleDarkPageExtension"
        });
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

    function multiclipboardCopy() {
        var selection= document.getSelection();
        var selectedText = selection.anchorNode.wholeText.substring(selection.anchorOffset, selection.focusOffset);
        if(selectedText) {

            CmdBox.set({
                title: 'Key as register',
                pressUp: function(e) {
                    var key = getKey(e);
                    if (isAcceptKey(key)) {
                        var content = CmdBox.get().content;
                        CmdBox.remove();
                        var registers = Settings.get('background.multiclipboardRegisters');

                        if(registers == undefined) {
                            registers = {};
                        }
                        registers[content] = selectedText;

                        Post({
                            action: "Page.saveSetting",
                            key: "multiclipboardRegisters",
                            value: registers
                        });
                    }
                },
                content: ''
            });
        }
    }

    function multiclipboardPaste() {
        CmdBox.set({
            title: 'Key as register',
            pressUp: function(e) {
                var key = getKey(e);
                if (isAcceptKey(key)) {
                    var content = CmdBox.get().content;
                    // use ! to copy into clipboard
             
                    CmdBox.remove();
                    var registers = Settings.get('background.multiclipboardRegisters');

                    var data = registers[content.replace('!', '')];
                    if(data && content.endsWith('!')) {
                        Post({
                            action: "Tab.copyData",
                            data: data
                        });
                    }
                }
            },
            content: ''
        });
    }

    function makeLinks() {
        document.body.innerHTML = replaceURLWithHTMLLinks(document.body.innerHTML);
        CmdBox.remove();
    }

    function replaceURLWithHTMLLinks(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp,"<a href='$1'>$1</a>");
    }

    function recordMacro() {
        CmdBox.set({
            title: 'Macro RECORDING: Enter register',
            pressUp: function(e) {
                var key = getKey(e);
                if (isAcceptKey(key)) {
                    var content = CmdBox.get().content;
                    CmdBox.remove();
                    Post({
                        action: "Page.recordMacro",
                        register: content
                    });
                }
            },
            content: ''
        });
    }

    function playMacro() {
         CmdBox.set({
            title: 'Enter count + register format [count;register]',
            pressUp: function(e) {
                var key = getKey(e);
                if (isAcceptKey(key)) {
                    var content = CmdBox.get().content;
                    var times = 1;
                    var reg = content;

                    if(content.indexOf(';') != -1) {
                       var tmp = content.split(';');
                       times = tmp[0];
                       reg = tmp[1];
                    }
                    
                    CmdBox.remove();
                    Post({
                        action: "Page.playMacro",
                        register: reg,
                        times: times
                    });
                }
            },
            content: ''
        });
    }

    function selectFrame(msg) {
        if(frameId == msg.frameId) {
            window.focus();
            var borderWas = document.body.style.border;
            document.body.style.border = '5px solid yellow';
            setTimeout(function(){
                document.body.style.border = borderWas
            }, 200);
        }
    }

    function printAll(msg) {
        document.write(msg.content);
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
            var msg = "Copied " + getSelected();

            if(Register.currentRegister) {
                msg += " into register " + Register.currentRegister;
            }
            Post({
                action: "Tab.copyData",
                data: getSelected(),
                register: Register.currentRegister
            });
        },
        toggleDarkPageExtension: toggleDarkPageExtension,
        disableStyles: disableStyles,
        disableImages: function() {
            disableByTag('img');
        },
        disableObjects: function() {
            disableByTag('object');
        },
        multiclipboardCopy: multiclipboardCopy,
        multiclipboardPaste: multiclipboardPaste,
        makeLinks: makeLinks,
        recordMacro: recordMacro,
        playMacro: playMacro,
        nextFrame: function() {
            Post({
                action: "Page.nextFrame",
                frameId: frameId,
                count: times()
            })
        },
        
        selectFrame: selectFrame,
        printAll: printAll

    };
})();

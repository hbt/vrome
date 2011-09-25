var InsertMode = (function(){
    var caret_position,value;

    function enterEditMode()
    {
        KeyEvent.disable();
        document.body.contentEditable='true';
        document.designMode='on';
    }

    function currentElement() {
        var elem = document.activeElement;
        caret_position = elem.selectionEnd;
        value = elem.value || elem.innerText;
        return elem;
    }

    function blurFocus(){
        var elem = currentElement();
        if (elem) elem.blur();
    }

    function focusFirstTextInput(){
        var elems = document.querySelectorAll('input[type="text"],input[type="search"],input:not([type])');
        var elem  = elems[times() - 1];
        if(!elem) return;

        elem.focus();
        elem.setSelectionRange(0,elem.value.length);
    }

    function moveToFirstOrSelectAll(){
        var elem = currentElement();
        elem.setSelectionRange(0,caret_position == 0 ? value.length : 0);
    }

    function moveToEnd(){
        var elem = currentElement();
        elem.setSelectionRange(value.length, value.length);
    }

    function deleteForwardChar(){
        var elem = currentElement();
        elem.value = value.substr(0,caret_position) + value.substr(caret_position + 1);
        elem.setSelectionRange(caret_position, caret_position);
    }

    function deleteBackwardChar(){
        var elem = currentElement();
        elem.value = value.substr(0,caret_position - 1) + value.substr(caret_position);
        elem.setSelectionRange(caret_position - 1, caret_position - 1);
    }

    function deleteBackwardWord(){
        var elem = currentElement();
        elem.value = value.substr(0,caret_position).replace(/[^\s\n.,]*?.\s*$/,'') + value.substr(caret_position);
        var position = elem.value.length - (value.length - caret_position);
        elem.setSelectionRange(position,position);
    }

    function deleteForwardWord(){
        var elem = currentElement();
        elem.value = value.substr(0,caret_position) + value.substr(caret_position).replace(/^\s*.[^\s\n.,]*/,'');
        elem.setSelectionRange(caret_position,caret_position);
    }

    function deleteToBegin(){
        var elem = currentElement();
        elem.value = value.substr(caret_position);
        elem.setSelectionRange(0,0);
    }

    function deleteToEnd(){
        var elem = currentElement();
        elem.value = value.substr(0,caret_position);
        elem.setSelectionRange(elem.value.length,elem.value.length);
    }

    function MoveBackwardWord() {
        var elem = currentElement();
        var str = value.substr(0,caret_position).replace(/[^\s\n.,]*?.\s*$/,'');
        elem.setSelectionRange(str.length,str.length);
    }

    function MoveForwardWord() {
        var elem = currentElement();
        var position = value.length - value.substr(caret_position).replace(/^\s*.[^\s\n.,]*/,'').length;
        elem.setSelectionRange(position,position);
    }

    function MoveBackwardChar(){
        var elem = currentElement();
        elem.setSelectionRange(caret_position - 1,caret_position - 1);
    }

    function MoveForwardChar(){
        var elem = currentElement();
        elem.setSelectionRange(caret_position + 1,caret_position + 1);
    }

    function gotoForwardChar() {
        var elem = currentElement();

        CmdBox.set({
            title: 'Key to go to',
            pressUp: function(e) {
                var key = getKey(e);
                var c = CmdBox.get().content;
                if (c !== '') {
                    CmdBox.remove();
                    elem.focus();
                    var i = elem.value.indexOf(c, caret_position);
                    elem.setSelectionRange(i+1, i+1);
                }
            },
            content: ''
        });
    }

    function externalEditor() {
        var elem    = this.target;
        var edit_id = String(Math.random());
        elem.setAttribute('vrome_edit_id',edit_id);
        elem.setAttribute('readonly','readonly');
        Post({
            action : "externalEditor",
            data : elem.value,
            edit_id : edit_id
        });
    }

    function externalEditorCallBack(msg) {
        var elem = document.querySelector('[vrome_edit_id="' + msg.edit_id + '"]');
        elem.value = msg.value;
        elem.removeAttribute('vrome_edit_id');
        elem.removeAttribute('readonly');
    }

    // API
    blurFocus.private = true;
    externalEditorCallBack.private = true;

    return {
        blurFocus              : blurFocus              ,
        focusFirstTextInput    : focusFirstTextInput    ,

        moveToFirstOrSelectAll : moveToFirstOrSelectAll ,
        moveToEnd              : moveToEnd              ,
        deleteForwardChar      : deleteForwardChar      ,
        deleteBackwardChar     : deleteBackwardChar     ,
        deleteForwardWord      : deleteForwardWord      ,
        deleteBackwardWord     : deleteBackwardWord     ,

        deleteToBegin          : deleteToBegin          ,
        deleteToEnd            : deleteToEnd            ,
        MoveBackwardWord       : MoveBackwardWord       ,
        MoveForwardWord        : MoveForwardWord        ,
        MoveBackwardChar       : MoveBackwardChar       ,
        MoveForwardChar        : MoveForwardChar        ,
        gotoForwardChar        : gotoForwardChar,

        externalEditor 				 : externalEditor,
        externalEditorCallBack : externalEditorCallBack,
        enterEditMode: enterEditMode
    }
})()

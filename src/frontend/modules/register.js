var Register = (function() {
   
    function add() {
        var key = getKey(this);

        CmdBox.set({
            title : "Wating command for register " + key
        });

        Register.currentRegister = key;
    }

    function initAddLong() {
        CmdBox.set({
            title : 'Enter name for register',
            pressUp: function(e) {
                var key = getKey(e);

                if (isAcceptKey(key)) {
                    var content = CmdBox.get().content;
                    Register.currentRegister = content;
                    CmdBox.remove();
                }
            },
            content : ''
        });
    }

    return {
        add: add,
        addLong: initAddLong
    }
})()

Register.currentRegister = null;
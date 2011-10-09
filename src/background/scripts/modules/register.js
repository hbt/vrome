var Register = (function() {

    function store(reg, data) {
        localStorage['reg_' + reg] = data;
    }

    function copyToClipboard(msg) {
        var reg = msg.register;
        var storageKey = 'reg_' + reg;
        if(localStorage[storageKey] !== undefined) {
            Tab.copyData({
                data: localStorage[storageKey]
            });
        }
    }

    function printAll() {
        var tab       = arguments[arguments.length-1];
        var content = "";

        var registers = localStorage.getMatchingKey(/^reg_/);

        for(key in registers) {
            var val = key.replace('reg_', '');
            content += "Register.store('" + val + "', '" + localStorage[key] + "');<br/>";
        }

        Post(tab, {
            action: "Marks.printAll",
            content: content
        });
    }


    function clearAll() {
        localStorage.delMatchingKey(/^reg_/);
    }

    return {
        store: store,
        copyToClipboard: copyToClipboard,
        printAll: printAll,
        clearAll: clearAll
    }
})()
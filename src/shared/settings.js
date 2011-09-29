var Settings = (function() {
    var key = '__vrome_setting';

    function extend(to,from) {
        if (!to) to = {};
        for(var p in from) to[p] = from[p];
        return to;
    }

    function currentSetting(){
        return JSON.parse(localStorage[key] || "{}");
    }

    function add(object) {
        if (object instanceof Object) {
            object            = extend( currentSetting(), object);
            localStorage[key] = JSON.stringify(object);
            return object;
        } else {
            var name  = arguments[0];
            var value = arguments[1];
            var old_object = object = currentSetting();
            var name = name.split('.');
            while (name.length > 1) {
                object = object[name.shift()];
            }
            object[name.shift()] = value;
            localStorage[key] = JSON.stringify(old_object);
            return old_object;
        }
    }

    function get(names) {
        var object = currentSetting();
        if(!names) return object;

        var names = names.split('.');
        while (object && names[0]) {
            object = object[names.shift()];
        }
        return (typeof object == 'undefined') ? '' : object;
    }

    function setValue(key, value) {
        if(key instanceof Object) {
            value = key.value;
            key = key.key;
        }
        localStorage[key] = value;
    }

    function getValue(key, defaultValue) {
        if(key instanceof Object) {
            defaultValue = key.defaultValue;
            key = key.key;
        }
        if(localStorage[key] === undefined) {
            return defaultValue;
        }
        return localStorage[key];
    }

    // copies a key from the background to the current page and calls the callback function when it is done
    function copyBackgroundValue(key, defaultValue) {
        var callback;
        if(key instanceof Object) {
            defaultValue = key.defaultValue;
            key = key.key;
            callback = key.callback;
        }
        if(localStorage[key] === undefined) {
            return defaultValue;
        }

//        var tab = arguments[arguments.length-1];
//        Post(tab,{
//            action : "Settings.setValue",
//            arguments : {
//                key: '.vromerc_script',
//                value: '.'
//            }
//        });
//        var value = localStorage[key];
//        Post({
//            action : "Settings.getValue",
//            arguments: {
//                key: '.vromerc_script'
//            }
//        });

    }

    return {
        add : add,
        get :get,
        setValue: setValue,
        getValue: getValue,
        copyBackgroundValue: copyBackgroundValue
    }
})();

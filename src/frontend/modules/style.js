var Style = (function(){

    function init() {
        Post({
            action : "Style.getCSSFile"
        });
    }

    function setCSS(msg) {
        var style = document.createElement("style");
        style.innerText = msg.css;
        document.documentElement.insertBefore(style, null);
    }

    return {
        init: init,
        setCSS: setCSS
    }
})()

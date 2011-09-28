var Style = (function(){

    function getCSSFile(msg) {
        var xhr = new XMLHttpRequest();
        var url = chrome.extension.getURL("styles/main.css");
        var tab = arguments[arguments.length-1];

        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4 && xhr.status == 0) {
                Post(tab,{
                    action : "Style.setCSS",
                    arguments : {
                        css: xhr.responseText
                    }
                });

            };
        }

        xhr.setRequestHeader("Content-type", "text/plain");
        xhr.send();
    }

    return {
        getCSSFile: getCSSFile
    }
})()

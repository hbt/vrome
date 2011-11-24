
function frontendExec() {
    // next key
    KeyEvent.add("v", KeyEvent.passNextKey);

    // links
    KeyEvent.add("f", Hint.start_string);
    KeyEvent.add("c", Hint.new_tab_start_string);

    // scroll
    KeyEvent.add("w", Scroll.up);
    KeyEvent.add("s", Scroll.down);
    KeyEvent.add("a", Scroll.left);
    KeyEvent.add("d", Scroll.right);
    KeyEvent.add("ga", Scroll.first);
    KeyEvent.add("gd", Scroll.last);
    KeyEvent.add("gf", Scroll.bottom);

    // history
    KeyEvent.add("A", History.back);
    KeyEvent.add("D", History.forward);

    // marks
    add("b", Marks.gotoQuickMarkNewTab);
}



function backendExec() {
    Marks.setQuickMark('sq', 'https://pmrobot.com/tickets/list?search_fields%5Bfilter_name%5D=myQueue&search_fields%5Bticket.SUBMITTED_BY_ID%5D=&search_fields%5Bticket.ASSIGNED_TO_ID%5D=14&search_fields%5Bticket.RESOLVED_BY_ID%5D=&search_fields%5Bticket.S_TICKET_TYPE_ID%5D=&search_fields%5Bticket.S_STATUS_TYPE_ID%5D%5B%5D=1&search_fields%5Bticket.S_STATUS_TYPE_ID%5D%5B%5D=2&search_fields%5Bticket.S_URGENCY_TYPE_ID%5D=&search_fields%5Bticket.SUBSORT%5D=&search_fields%5Bticket.MILESTONE_ID%5D=&search_fields%5Bticket.RESOLVED_MILESTONE_ID%5D=&search_fields%5Bticket.CLIENT_APPROVAL_ID%5D=&search_fields%5Bticket.EFFORT%5D=&search_fields%5Bticket.RISK%5D=&sort_fields%5Bsort1%5D=&sort_fields%5BsortOrder1%5D=&sort_fields%5Bsort2%5D=&sort_fields%5BsortOrder2%5D=&search_advanced=&selectedSearchLink=searchMyQueue');
    Marks.setQuickMark('eztv', 'http://thepiratebay.org/user/eztv/');
    Marks.setQuickMark('tbm', 'http://thepiratebay.org/top/201');
    Marks.setQuickMark('st', 'https://pmrobot.com/time_entry/other');
    Marks.setQuickMark('r', '::javascript::CustomMark.readLater();');
    Marks.setQuickMark('pp', '::javascript::CustomMark.prod();');
    Marks.setQuickMark('v', 'https://github.com/hbt/vrome/issues?labels=&milestone=&state=open');
    Marks.setQuickMark('webkit', 'http://developer.apple.com/library/safari/documentation/AppleApplications/Reference/WebKitDOMRef/index.html');
    Marks.setQuickMark('R', '::javascript::CustomMark.readability();');
    Marks.setQuickMark('tfctms', 'http://test.empowerhealthresearch.ca/form_editor.php');
    Marks.setQuickMark('d', 'http://localhost:8084/my_dbs.php');
    Marks.setQuickMark('dd', '::javascript::CustomMark.debug();');
    Marks.setQuickMark('f', 'http://localhost:7071/form_editor.php');
    Marks.setQuickMark('i', 'http://www.instapaper.com/u');
    Marks.setQuickMark('cd', '::javascript::CustomMark.convertURLCTMSDev();');
    Marks.setQuickMark('V', 'http://www.vocabulary.com/');
    Marks.setQuickMark('hn', 'http://news.ycombinator.com/classic');
    Marks.setQuickMark('chr', 'http://code.google.com/chrome/extensions/api_index.html');
    Marks.setQuickMark('vtv', 'http://thepiratebay.org/user/vtv/');
    Marks.setQuickMark('bcpa', 'http://localhost:7073/index.php/');
    Marks.setQuickMark('sr', 'https://pmrobot.com/time_entry/report');
    Marks.setQuickMark('tts', 'https://pmrobot.com/newsfeed/tts');
    Marks.setQuickMark('pmr', 'http://localhost:7074/index.php/home');
    Marks.setQuickMark('rd', 'http://ruby-doc.org/core/');
    Marks.setQuickMark('e', 'chrome://extensions/');
    Marks.setQuickMark('gr', 'http://www.google.com/reader/view/#overview-page');
    Marks.setQuickMark('tbs', 'http://thepiratebay.org/top/205');
    Marks.setQuickMark('cmsf', 'http://localhost:7072/frontend_debug.php');
    Marks.setQuickMark('cp', '::javascript::CustomMark.convertURLCTMSProd();');
    Marks.setQuickMark('pfctms', 'https://secure.empowerhealthresearch.ca/secure/form_editor.php');
}

var CustomMark = {

    convertURLCTMSProd: function() {
        var location=window.location.href;
        location=location.replace("localhost:7071","secure.empowerhealthresearch.ca");
        location=location.replace("frontend_debug.php","");
        location=location.replace("index.php","");
        window.location.href=location;
    },

    convertURLCTMSDev: function() {
        var location=window.location.href;
        location=location.replace("https","http");
        location=location.replace("secure.empowerhealthresearch.ca/secure","localhost:7071/index.php");
        window.location.href=location;
    },

    prod : function() {
        var location=window.location.href;
        location=location.replace("frontend_dev.php","index.php");
        location=location.replace("frontend_debug.php","index.php");
        window.location.href=location;
    },

    debug: function() {
        var location=window.location.href;
        location=location.replace("index.php","frontend_debug.php");
        window.location.href=location;
    },

    readLater: function() {
        var d=document,z=d.createElement('scr'+'ipt'),b=d.body,l=d.location;
        try{
            if(!b)throw(0);
            d.title='(Saving...) '+d.title;
            z.setAttribute('src',l.protocol+'//www.instapaper.com/j/OxGMe632WAee?u='+encodeURIComponent(l.href)+'&t='+(new Date().getTime()));
            b.appendChild(z);
        }catch(e){
            alert('Please wait until the page has loaded.');
        }
    },

    readability: function () {
        readConvertLinksToFootnotes=false;
        readStyle='style-apertura';
        readSize='size-x-large';
        readMargin='margin-x-narrow';
        _readability_script=document.createElement('script');
        _readability_script.type='text/javascript';
        _readability_script.src='http://lab.arc90.com/experiments/readability/js/readability.js?x='+(Math.random());
        document.documentElement.appendChild(_readability_script);
        _readability_css=document.createElement('link');
        _readability_css.rel='stylesheet';
        _readability_css.href='http://lab.arc90.com/experiments/readability/css/readability.css';
        _readability_css.type='text/css';
        _readability_css.media='all';
        document.documentElement.appendChild(_readability_css);
        _readability_print_css=document.createElement('link');
        _readability_print_css.rel='stylesheet';
        _readability_print_css.href='http://lab.arc90.com/experiments/readability/css/readability-print.css';
        _readability_print_css.media='print';
        _readability_print_css.type='text/css';
        document.getElementsByTagName('head')[0].appendChild(_readability_print_css);
    }
}

var AcceptKey = ["<Enter>","<C-j>","<C-m>"];
var CancelKey = ["<Esc>", "<C-[>"];
var EscapeKey = ["<Esc>", "<C-[>"];

function isAcceptKey(key) {
    for (var i=0;i < AcceptKey.length; i++) {
        if (AcceptKey[i] == key) return true;
    }
}

function AcceptKeyFunction() {
    Url.enter();
    CmdLine.exec();
    Search.next();
    Buffer.gotoFirstMatchHandle();
    Buffer.deleteMatchHandle();
}

function isEscapeKey(key) {
    for (var i=0;i < EscapeKey.length; i++) {
        if (EscapeKey[i] == key) return true;
    }
}

function EscapeKeyFunction() {
    KeyEvent.enable();
    CancelKeyFunction();
}

function CancelKeyFunction() {
    CmdBox.remove();
    Hint.remove();
    Search.stop();
    InsertMode.blurFocus();
    KeyEvent.reset();
}

with (KeyEvent) {
    var arr = ["AcceptKey","CancelKey","EscapeKey"];
    for (var i=0; i < arr.length; i++) {
        var keys = window[arr[i]];
        for (var j=0; j < keys.length; j++) {
            add(keys[j], window[arr[i] + "Function"]       );
            add(keys[j], window[arr[i] + "Function"], true );
        }
    }

    add("<F1>", showHelp );

    // Zoom
    add("z", Zoom["in"]      );
    add("x", Zoom.out        );
    add("Zz", Zoom.reset      );
    add("Zr", Zoom.reset      );

    // Page
    add("]]", Page.next         );
    add("[[", Page.prev         );
    add("Y" , Page.copySelected );
    add("Sd" , Page.toggleDarkPageExtension );
    add("Ss" , Page.disableStyles );
    add("Si" , Page.disableImages);
    add("So" , Page.disableObjects );
    add("<M-y>", Page.multiclipboardCopy);
    add("<M-p>", Page.multiclipboardPaste);


    // Url
    add("gu"    , Url.parent             );
    add("gU"    , Url.root               );
    add("gF"    , Url.viewSourceNewTab   );
    add("<C-a>" , Url.increment          );
    add("<C-x>" , Url.decrement          );
    add("o"     , Url.open               );
    add("O"     , Url.openWithDefault    );
    add("tt"     , Url.tabopen            );
    //  add("T"     , Url.tabopenWithDefault );
    add("<C-y>" , Url.shortUrl           );


    // Scroll
    add("gg" , Scroll.top       );
    add("G"  , Scroll.bottom    );
    add("0"  , Scroll.first     );
    add("ga"  , Scroll.first     );
    add("$"  , Scroll.last      );
    add("gd"  , Scroll.last      );

    add("k"  , Scroll.up        );
    add("j"  , Scroll.down      );
    add("h"  , Scroll.left      );
    add("l"  , Scroll.right     );
    add("%"  , Scroll.toPercent );

    //  add("<C-f>" , Scroll.nextPage     );
    add("<C-b>" , Scroll.prevPage     );
    add("<C-d>" , Scroll.nextHalfPage );
    add("<C-u>" , Scroll.prevHalfPage );


    // Tab
    add("r"    , Tab.reload       );
    add("R"    , Tab.reloadAll    );
    add("tw"    , Tab.close        );
    add("tcc"    , Tab.closeOtherTabs        );
    add("tce"    , Tab.closeRightTabs        );
    add("tcq"    , Tab.closeLeftTabs        );
    add("tcw"    , Tab.closeOtherWindows        );
    add("tW"    , Tab.closeCurrentWindow);
    add("td"    , Tab.detachTab        );
    add("tM"    , Tab.markTabForMove);
    add("tp"    , Tab.putMarkedTab);
    add("tq"    , Tab.moveTabLeft);
    add("te"    , Tab.moveTabRight);
    //  add("D"    , Tab.closeAndFoucsLeft );
    //  add("<M-d>", Tab.closeAndFoucsLast );
    add("tu"    , Tab.reopen       );
    add("e"   , Tab.next         );
    add("q"   , Tab.prev         );

    add("yy"     , Tab.copyUrl      );
    add("g0"    , Tab.first        );
    add("g^"    , Tab.first        );
    add("g$"    , Tab.last         );
    add("``" , Tab.selectPrevious );


    // History
    add("H"    , History.back    );
    add("L"    , History.forward );


    // CmdLine
    add(":"    , CmdLine.start   );


    // Hint
    add("f"  , Hint.start         );
    add("F"  , Hint.new_tab_start );
    add("<M-f>"  , Hint.start_string         );
    add("<M-c>"  , Hint.new_tab_start_string );
    add("<M-s>"  , Hint.new_tab_start_string_repeat );


    // Search
    add("/"      , Search.start          );
    add("?"      , Search.backward       );
    add("n"      , Search.next           );
    add("N"      , Search.prev           );
    add("*"      , Search.forwardCursor  );
    add("#"      , Search.backwardCursor );
    add("<S-Enter>", Search.prev,   true );


    // Buffer
    add("b" , Buffer.gotoFirstMatch );
    add("B" , Buffer.deleteMatch    );


    add("gi" , InsertMode.focusFirstTextInput );
    add("<C-z>" , KeyEvent.disable            );
    add("<C-v>" , KeyEvent.passNextKey        );
    add("."     , KeyEvent.runLast            );

    add("M", Marks.addQuickMark);
    add("go", Marks.gotoQuickMark);
    add("gn", Marks.gotoQuickMarkNewTab);

    // a-zA-Z
    for (var i = 65; i <= 122; i++) {
        if (i > 90 && i < 97) continue;

        add("m" + String.fromCharCode(i), Marks.addLocalMark  );
        add("'" + String.fromCharCode(i), Marks.gotoLocalMark );
    }


    // InsertMode
    add("ii", InsertMode.enterEditMode);
    add("ik", InsertMode.test);

    add("<C-i>", InsertMode.externalEditor        , true );
    add("<M-v>", KeyEvent.passNextKey, true );

    add("<C-a>", InsertMode.moveToFirstOrSelectAll, true );
    add("<C-e>", InsertMode.moveToEnd             , true );

    add("<C-h>", InsertMode.deleteBackwardChar    , true );
    add("<C-d>", InsertMode.deleteForwardChar     , true );

    add("<C-w>", InsertMode.deleteBackwardWord    , true );
    add("<M-d>", InsertMode.deleteForwardWord     , true );

    add("<C-u>", InsertMode.deleteToBegin       , true );
    add("<C-k>", InsertMode.deleteToEnd         , true );

    add("<M-h>", InsertMode.MoveBackwardWord    , true );
    add("<M-l>", InsertMode.MoveForwardWord     , true );

    add("<M-j>", InsertMode.MoveBackwardChar    , true );
    add("<M-k>", InsertMode.MoveForwardChar     , true );
    add("<M-f>", InsertMode.gotoForwardChar     , true );
    }


with (CmdLine) {
    add("help", showHelp );
    add("bdelete", Buffer.deleteMatchHandle );
    }

// Initial
var initFunction = [ Zoom.init, KeyEvent.init, Style.init];
runIt();
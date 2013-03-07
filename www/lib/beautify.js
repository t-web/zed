define(function(require, exports, module) {
    var eventbus = require("eventbus");
    var editor = require("editor");

    var beautifiers = exports.beautifiers = {
        "ace/mode/css": require("util/beautify-css"),
        "ace/mode/javascript": require("util/beautify-javascript"),
        "ace/mode/html": require("util/beautify-html")
    };

    function beautify(session) {
        var mode = session.mode;
        if (beautifiers[mode]) {
            var range = session.getSelection().getRange();
            var text = session.getTextRange(range);
            var reformattedText = beautifiers[mode](text);
            session.replace(range, reformattedText);
        }
    }

    exports.hook = function() {
        eventbus.once("keysbindable", function(keys) {
            keys.bind("Command-Shift-b", function() {
                beautify(editor.getActiveEditor().getSession());
            });
        });
    };
});
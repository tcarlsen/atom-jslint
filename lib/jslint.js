/*global atom, require, module*/

var JSLINT = require('jslint').load('latest');

module.exports = {
    activate: function () {
        'use strict';

        return atom.workspaceView.command('jslint', this.lint);
    },
    lint: function () {
        'use strict';

        var editor = atom.workspace.getActiveEditor(),
            content = editor.getText(),
            langues = editor.getGrammar().name,
            data,
            errtext;

        if (langues === 'JavaScript') {
            JSLINT(content);

            data = JSLINT.data();
            errtext = JSLINT.error_report(data);

            if (atom.workspaceView.find('.jslint').length !== 1) {
                atom.workspaceView.prependToBottom('<div class="jslint tool-panel panel-bottom padded"></div>');
            }

            atom.workspaceView.find('.jslint').html(errtext);
        }
    }
};

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
                atom.workspaceView.prependToBottom('<div class="jslint tool-panel panel-bottom" />');
                atom.workspaceView.find('.jslint')
                    .append('<div class="panel-heading">JSLint report <button type="button" class="close" aria-hidden="true">&times;</button></div>')
                    .append('<div class="panel-body padded" />');
                atom.workspaceView.find('.jslint .close').click(function () {
                    atom.workspaceView.find('.jslint').remove();
                });
            }
            if (data.errors.length === 0) {
                atom.workspaceView.find('.jslint .panel-body').html('<h1 class="text-success">√ No errors was found!</h1>');
            } else {
                atom.workspaceView.find('.jslint .panel-body').html(errtext);
            }
        }
    }
};

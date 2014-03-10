/*global atom, require, module*/

var JSLINT = require('jslint').load('latest');
var msgPanel = require('atom-message-panel');

module.exports = function () {
    'use strict';

    var editor = atom.workspace.getActiveEditor(),
        content,
        data,
        error,
        i;

    if (!editor) {
        return;
    }

    if (editor.getGrammar().name === 'JavaScript') {
        content = editor.getText();

        JSLINT(content);

        data = JSLINT.data();

        if (atom.workspaceView.find('.am-panel').length !== 1) {
            msgPanel.init('JSLint report');
        } else {
            msgPanel.clear();
        }

        if (data.errors.length === 0) {
            msgPanel.append.header('√ No errors were found!', 'text-success');
        } else {
            for (i = 0; i < data.errors.length; i += 1) {
                error = data.errors[i];

                if (error) {
                    if (error.code) {
                        error.reason = error.reason.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        error.evidence = error.evidence.trim();

                        msgPanel.append.lineMessage(error.line, error.character, error.reason, error.evidence, 'text-error');
                    } else {
                        msgPanel.append.message(String(error.reason), 'text-info');
                    }
                }
            }
        }

        atom.workspaceView.on('pane-container:active-pane-item-changed destroyed', function () {
            msgPanel.destroy();
        });
    }
};

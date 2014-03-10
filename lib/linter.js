/*global atom, require, module*/

var JSLINT = require('jslint').load('latest');

module.exports = function () {
    'use strict';

    var editor = atom.workspace.getActiveEditor(),
        content,
        data,
        error,
        pre,
        i,
        addClick = function (pre, line, character) {
            pre.click(function () {
                editor.cursors[0].setBufferPosition([line - 1, character - 1]);
            });
        };

    if (!editor) {
        return;
    } else if (editor.getGrammar().name === 'JavaScript') {
        content = editor.getText();

        JSLINT(content);

        data = JSLINT.data();

        if (atom.workspaceView.find('.jslint').length !== 1) {
            atom.workspaceView.prependToBottom('<div class="jslint tool-panel panel-bottom" />');
            atom.workspaceView.find('.jslint')
                .append('<div class="panel-heading">JSLint report <button type="button" class="close" aria-hidden="true">&times;</button></div>')
                .append('<div class="panel-body padded" />');
            atom.workspaceView.find('.jslint .close').click(function () {
                atom.workspaceView.find('.jslint').remove();
            });
        } else {
            atom.workspaceView.find('.jslint .panel-body').html('');
        }

        if (data.errors.length === 0) {
            atom.workspaceView.find('.jslint .panel-body').append('<h1 class="text-success">√ No errors was found!</h1>');
        } else {
            for (i = 0; i < data.errors.length; i += 1) {
                error = data.errors[i];

                if (error) {
                    if (error.code) {
                        atom.workspaceView.find('.jslint .panel-body')
                            .append('<div class="text-subtle inline-block">at line ' + String(error.line) + ', character ' + String(error.character) + '</div>')
                            .append('<div class="text-error inline-block">' + error.reason.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>')
                            .append('<pre>' + error.evidence.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');

                        pre = atom.workspaceView.find('.jslint .panel-body pre:last-child');

                        addClick(pre, error.line, error.character);
                    } else {
                        atom.workspaceView.find('.jslint .panel-body').append('<div class="block text-info">' + String(error.reason) + '</div>');
                    }
                }
            }
        }

        atom.workspaceView.on('pane-container:active-pane-item-changed destroyed', function () {
            atom.workspaceView.find('.jslint').remove();
        });
    }
};

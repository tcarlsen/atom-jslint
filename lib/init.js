/*global atom, require, module*/

var linter = require('./linter');

module.exports = {
    configDefaults: {
        validateOnSave: true
    },
    activate: function () {
        'use strict';

        atom.workspaceView.command('jslint', linter);

        atom.config.observe('jslint.validateOnSave', {callNow: true}, function (value) {
            if (value === true) {
                atom.workspace.eachEditor(function (editor) {
                    editor.buffer.on('saved', linter);
                });
            } else {
                atom.workspace.eachEditor(function (editor) {
                    editor.buffer.off('saved', linter);
                });
            }
        });
    }
};

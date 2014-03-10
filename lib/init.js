/*global atom, require, module*/

var linter = require('./linter');

module.exports = {
    activate: function () {
        'use strict';

        return atom.workspaceView.command('jslint', linter);
    }
};

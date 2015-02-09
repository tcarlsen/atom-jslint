linter = require "./linter"
module.exports =
  config:
    jslintVersion:
      type: "string"
      default: "latest"
      enum: ["latest", "2014-07-08", "2014-04-21", "2014-02-06", "2014-01-26", "2013-11-23", "2013-09-22", "2013-09-22", "2013-08-26", "2013-08-13", "2013-02-03"]
    validateOnSave:
      type: "boolean"
      default: true
    validateOnChange:
      type: "boolean"
      default: false
    hideOnNoErrors:
      type: "boolean"
      default: false
    useFoldModeAsDefault:
      type: "boolean"
      default: false

  activate: ->
    editor = atom.workspace.getActiveTextEditor()

    atom.commands.add "atom-workspace", "jslint:lint", linter
    atom.config.observe "jslint.validateOnSave", (value) ->
      if value is true
        atom.workspace.eachEditor (editor) ->
          editor.buffer.on "saved", linter
      else
        atom.workspace.eachEditor (editor) ->
          editor.buffer.off "saved", linter

    atom.config.observe "jslint.validateOnChange", (value) ->
      if value is true
        atom.workspace.eachEditor (editor) ->
          editor.buffer.on "contents-modified", linter
      else
        atom.workspace.eachEditor (editor) ->
          editor.buffer.off "contents-modified", linter

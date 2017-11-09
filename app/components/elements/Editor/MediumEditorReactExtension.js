var React = require('react')
var ReactDOM = require('react-dom')
var MediumEditor = require('medium-editor')

module.exports = function (Button) {
  var Extension = MediumEditor.extensions.button.extend({
    init: function () {
      MediumEditor.Extension.prototype.init.apply(this, arguments)

      this.button = this.createButton()
    },
    createButton: function () {
      var button = document.createElement('div')

      ReactDOM.render(
        React.createElement(Button, {editor: this.base}),
        button
      )

      return button
    }
  })

  return Extension
}
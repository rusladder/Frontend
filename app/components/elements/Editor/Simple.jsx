import React from 'react'
import SimpleMDEReact from 'react-simplemde-editor'
import 'node_modules/react-simplemde-editor/demo/dist/stylesheets/vendor.css'

export default class SimpleEditor extends React.Component {

    getMarkdownOptions() {
        return {
            autofocus: false,
            spellChecker: false,
            status : false,
            showIcons: [
               "strikethrough", "code", "table", 'horizontal-rule'
            ],
            hideIcons: [
                "guide", 'side-by-side', 'fullscreen'
            ],
            promptURLs: true,
            initialValue: this.props.value
        }
    }

    render() {
        return (<SimpleMDEReact
            onChange={this.props.handleEditorChange}
            options={this.getMarkdownOptions()}
            label={this.props.label}
            value={this.props.value}
            extraKeys={this.props.extraKeys}/>);
    }

}

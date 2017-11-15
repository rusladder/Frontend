import React from 'react'
import SimpleMDEReact from 'react-simplemde-editor'
import 'node_modules/react-simplemde-editor/demo/dist/stylesheets/vendor.css'
import tt from 'counterpart'

export default class SimpleEditor extends React.Component {

    static propTypes = {
        body: React.PropTypes.object,
        onChange: React.PropTypes.func
    }

    constructor(props) {
        super(props)
    }

    getMarkdownOptions() {
        return {
            autofocus: false,
            spellChecker: false,
            status: false,
            showIcons: [
                "strikethrough", "code", "table", 'horizontal-rule'
            ],
            hideIcons: [
                "guide", 'side-by-side', 'fullscreen'
            ],
            promptURLs: true,
            initialValue: this.props.value,
            placeholder: tt('g.write_your_story')
        }
    }

    render() {
        const {body, onChange} = this.props

        return (<SimpleMDEReact
            onChange={onChange}
            options={this.getMarkdownOptions()}
            value={body.value}
            extraKeys={this.props.extraKeys}/>);
    }

}

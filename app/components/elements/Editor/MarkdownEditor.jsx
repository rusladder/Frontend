import React from 'react'
import './mde.css'
import tt from 'counterpart'
import SimpleMDE from 'simplemde'

export default class MarkdownEditor extends React.Component {

    static propTypes = {
        body: React.PropTypes.object,
        onChange: React.PropTypes.func,
    }

    static defaultProps = {
        id: 0,
    }

    constructor(props) {
        super(props)
        this.state = {keyChange: false};
    }

    componentWillMount() {
        this.setState({id : this.props.id + 1});
    }

    componentDidMount() {
        this.createEditor()
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.keyChange && (nextProps.value !== this.state.simplemde.value())) {
          this.state.simplemde.value(nextProps.value)
        }
    
        this.setState({
          keyChange: false
        });
    }

    createEditor() {
        const initialOptions = {
          element: document.getElementById(this.state.id+"-markdown-textarea"),
        }
        const allOptions = Object.assign({}, initialOptions, this.getMarkdownOptions());
        this.setState({simplemde : new SimpleMDE(allOptions)})
    }

    getMarkdownOptions() {
        return {
            autofocus: false,
            spellChecker: false,
            status: false,
            showIcons: [
                "strikethrough", "code", 'horizontal-rule'
            ],
            hideIcons: [
                "guide", 'side-by-side', 'fullscreen'
            ],
            promptURLs: true,
            initialValue: this.props.body.value,
            placeholder: tt('g.write_your_story'),
            autoDownloadFontAwesome: true
        }
    }

    render() {
        const {body, onChange} = this.props
        
        const textarea = <textarea key={this.state.id} id={`${this.state.id}-markdown-textarea`} />

        return (
            <div id={`${this.state.id}-markdown-editor-wrapper`}>
                {textarea}
            </div>)
    }

}

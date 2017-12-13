import React from 'react'
import tt from 'counterpart'
import SimpleMDE from 'simplemde'

export default class MarkdownEditor extends React.Component {

    static propTypes = {
        body: React.PropTypes.object,
        onChange: React.PropTypes.func,
        uploadImage: React.PropTypes.func
    }

    static defaultProps = {
        id: 0
    }

    constructor(props) {
        super(props)
        this.state = {
            keyChange: false
        }
        this.createEditor = this.createEditor.bind(this)
        this.eventWrapper = this.eventWrapper.bind(this)
        this.removeEvents = this.removeEvents.bind(this)
        this.addEvents = this.addEvents.bind(this)
        this.onDropEvent = this.onDropEvent.bind(this)
    }

    componentWillMount() {
        this.setState({
            id: this.props.id + 1
        })
    }

    componentDidMount() {
        this.createEditor()
        this.addEvents()
    }

    componentWillUnmount() {
        this.removeEvents()
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.keyChange && (nextProps.value !== this.state.simplemde.value())) {
            this
                .state
                .simplemde
                .value(nextProps.value)
        }

        this.setState({keyChange: false})
    }

    createEditor() {
        const initialOptions = {
            element: document.getElementById(this.state.id + "-markdown-textarea")
        }
        const allOptions = Object.assign({}, initialOptions, this.getMarkdownOptions())
        this.setState({simplemde: new SimpleMDE(allOptions)})
    }

    eventWrapper() {
        this.setState({keyChange: true})
        this.props.onChange(this.state.simplemde.value())
    }

    removeEvents() {
        this.editorEl.removeEventListener('keyup', this.eventWrapper)
        this.editorToolbarEl && this.editorToolbarEl.removeEventListener('click', this.eventWrapper)
        this.editorEl.removeEventListener('drop', this.onDropEvent)
    }

    addEvents() {
        const wrapperId = `${this.state.id}-markdown-editor-wrapper`
        const wrapperEl = document.getElementById(`${wrapperId}`)
        this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0]
        this.editorToolbarEl = wrapperEl.getElementsByClassName('editor-toolbar')[0]

        this.editorEl.addEventListener('keyup', this.eventWrapper)
        this.editorToolbarEl && this.editorToolbarEl.addEventListener('click', this.eventWrapper)
        this.editorEl.addEventListener('drop', this.onDropEvent)
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
            blockStyles: {
                italic: "_"
            },
            dragDrop: true,
            promptURLs: true,
            value: this.props.body.value,
            onChange: this.props.onChange,
            initialValue: this.props.body.value,
            placeholder: tt('g.write_your_story'),
            autoDownloadFontAwesome: true
        }
    }

    onDropEvent = (event) => {
        let coords = this.state.simplemde.codemirror.coordsChar({
            left: event.pageX,
            top: event.pageY
        })
        this.setState({dropCoords: coords})
    }

    render() {
        let {dropCoords} = this.state

        insertImage = (imageUrl) => {
            this.state.simplemde.codemirror.replaceRange(imageUrl, dropCoords);
        }

        const textarea = <textarea key={this.state.id} id={`${this.state.id}-markdown-textarea`}/>

        return (
            <div id={`${this.state.id}-markdown-editor-wrapper`}>
                {textarea}
            </div>
        )
    }
}

let insertImage = () => {}
export {insertImage}
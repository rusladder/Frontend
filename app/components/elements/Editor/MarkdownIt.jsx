var React = require('react')
var Markdown = require('react-markdown')
 
import toMarkdown from 'to-markdown'

export default class MarkdownIt extends React.Component {

    static propTypes = {
        body: React.PropTypes.object,
        onChange: React.PropTypes.func
    }

    constructor(props) {
        super(props)
        this.setState({markdown : ''})

    }

    render() {
        const {body, onChange} = this.props
        
        var input = '# This is a header\n\nAnd this is a paragraph';

        return (
            <div>
                {/* Pass Markdown source to the `source` prop */}
                <Markdown source={body.markdown}/>
            </div>
        )
    }
}
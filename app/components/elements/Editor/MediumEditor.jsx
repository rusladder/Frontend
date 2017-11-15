import React from 'react'
import tt from 'counterpart'
import Editor from 'react-medium-editor'

import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/beagle.css'



export default class MediumEditor extends React.Component {

    static propTypes = {
        body: React.PropTypes.object,
        onChange: React.PropTypes.func     
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {body, onChange} = this.props

        return (<Editor
            {...body.props}
            onBlur={body.onBlur}
            onChange={onChange}
            className='GolosEditor__medium__body'
            text={body.pureHTML}
            options={{
            toolbar: {
                buttons: [
                    'bold',
                    'italic',
                    'strikethrough',
                    'anchor',
                    'h1',
                    'h2',
                    'quote',
                    'orderedlist',
                    'unorderedlist',
                    'image'
                ]
            },
            placeholder: {
                text: tt('g.write_your_story'),
                hideOnClick: true
            }
        }}/>)
    }
}
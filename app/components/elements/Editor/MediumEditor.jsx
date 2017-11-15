import React from 'react'
import {Link} from 'react-router'

import Icon from 'app/components/elements/Icon.jsx'
import {SUPPORT_EMAIL} from 'app/client_config'
import tt from 'counterpart'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/beagle.css'
import Editor from 'react-medium-editor'


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
            className='CodeMirror'
            onChange={onChange}
            text={body.value}
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
import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6

export default class QuillEditor extends React.Component {

    static propTypes = {
        body: React.PropTypes.object,
        onChange: React.PropTypes.func
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {body, onChange} = this.props

        return (<ReactQuill
            {...body.props}
            value={body.value}
            onChange={onChange}/>)
    }
}
import React from 'react';
// import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import ReplyEditor from 'app/components/elements/ReplyEditor'

import Editor from 'app/components/elements/Editor/GolosEditor'

const formId = 'submitStory'
const SubmitReplyEditor = ReplyEditor(formId)

const GolosEditor = Editor(formId)

class SubmitPost extends React.Component {
    // static propTypes = {     routeParams: React.PropTypes.object.isRequired, }
    constructor() {
        super()
        this.success = (/*operation*/) => {
            // const { category } = operation localStorage.removeItem('replyEditorData-' +
            // formId)
            browserHistory.push('/created') //'/category/' + category)
        }
    }
    render() {
        const {success} = this
        const {query} = this.props.location
        return (
            <div className="SubmitPost">
               {/* <SubmitReplyEditor type={query.type || 'submit_story'} successCallback={success} /> */}
               <GolosEditor type={query.type || 'submit_story'} successCallback={success}/>
            </div>
        );
    }
}

module.exports = {
    path: 'submit.html',
    component: SubmitPost // connect(state => ({ global: state.global }))(SubmitPost)
};

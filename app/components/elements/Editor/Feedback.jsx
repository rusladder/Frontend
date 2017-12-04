import React from 'react'
import {Link} from 'react-router'

import Icon from 'app/components/elements/Icon.jsx'
import {SUPPORT_EMAIL} from 'app/client_config'
import tt from 'counterpart'

export default class Feedback extends React.Component {

    render() {
        
        return (
            <div className='GolosEditor__feedback'>
                <h4>{tt('reply_editor.feedback_welcome.dear_users')}</h4>
                <p>{tt('reply_editor.feedback_welcome.message1')}</p>
                <p>{tt('reply_editor.feedback_welcome.message2')}</p>
                <p>
                    {tt('reply_editor.feedback_welcome.message3')}
                    <Link to="/submit.html"><Icon name="pencil"/> {tt('g.submit_a_story')}</Link>
                    {tt('reply_editor.feedback_welcome.message4')}
                </p>
                <p>{tt('reply_editor.questions_or_requests')}
                    <a href={"mailto:" + SUPPORT_EMAIL}>{SUPPORT_EMAIL}</a>.</p>
                <p>{tt('reply_editor.support_by_telegram')}
                    —
                    <a href="https://t.me/golos_support">https://t.me/golos_support</a>.</p>
                <p>{tt('reply_editor.feedback_welcome.message5')}</p>
            </div>
        )
    }
}
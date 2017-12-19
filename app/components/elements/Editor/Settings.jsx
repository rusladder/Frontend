import React from 'react'
import tt from 'counterpart'

export default class GolosEditorSettings extends React.Component {


    static propTypes = {
        isStory: React.PropTypes.bool,
        isFeedback: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        
    }

    constructor(props) {
        super(props)
    }
    

    render() {

        let {isStory, isFeedback} = this.props

        if (isStory && !isFeedback) {
            return 
                <div className='GolosEditor__settings row'>
                    <div className='column small-12 large-6'>                    
                        <label title={tt('reply_editor.check_this_to_auto_upvote_your_post')}>
                            {tt('g.upvote_post')}&nbsp;
                            <input type="checkbox" checked={autoVote.value} onChange={autoVoteOnChange}/>
                        </label>
                    </div>
                    <div className='column small-12 large-6'>
                        <div className="ReplyEditor__options float-right text-right">
                            {tt('g.rewards')}:&nbsp;
                            <select
                                value={this.state.payoutType}
                                onChange={this.onPayoutTypeChange}
                                style={{
                                color: this.state.payoutType == '0%'
                                    ? 'orange'
                                    : 'inherit'
                            }}>
                                <option value="100%">{tt('reply_editor.power_up_100')}</option>
                                <option value="50%">{tt('reply_editor.default_50_50')}</option>
                                <option value="0%">{tt('reply_editor.decline_payout')}</option>
                            </select>

                            <br/>
                        </div>
                    </div>
                </div>        
    } else 
        return null
    }
}
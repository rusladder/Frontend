import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import reactForm from 'app/utils/ReactForm';
import transaction from 'app/redux/Transaction';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import runTests, { browserTests } from 'app/utils/BrowserTests';
import { validate_account_name } from 'app/utils/ChainValidation';
import { countDecimals } from 'app/utils/ParsersAndFormatters';
import tt from 'counterpart';

class AssetActions extends Component {

    static propTypes = {
        assetName:  PropTypes.string.isRequired,
        issuer: PropTypes.object.isRequired,
    };

    constructor(props) {
        super();
        this.state = {};
        this.initForm(props);
    }

    componentDidMount() {
        setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.to).focus()
        }, 300)
        runTests()
    }

    initForm(props) {
        const fields = ['to', 'amount', 'memo'];

        reactForm({
            name: 'transfer',
            instance: this, fields,
            initialValues: props.initialValues,
            validation: values => ({
                to:
                    !values.to ? tt('g.required') : validate_account_name(values.to),
                amount:
                    ! values.amount ? tt('g.required') :
                        ! /^[0-9]*\.?[0-9]*/.test(values.amount) ? tt('transfer_jsx.amount_is_in_form') : null,
                memo:
                    values.memo && (!browserTests.memo_encryption && /^#/.test(values.memo)) ?
                        'Encrypted memos are temporarily unavailable (issue #98)' :
                        null,
            })
        })
    }

    clearError = () => {this.setState({ trxError: undefined })};

    errorCallback = estr => { this.setState({ trxError: estr, loading: false }) };

    onChangeTo = (e) => {
        const {value} = e.target
        this.state.to.props.onChange(value.toLowerCase().trim())
    };

    render() {
        const { to, amount, memo } = this.state;
        const { loading, trxError } = this.state;
        const { submitting, valid, handleSubmit } = this.state.transfer;
        const { issuer, assetName, dispatchSubmit } = this.props;

        // const isMemoPrivate = memo && /^#/.test(memo.value);
        const form = (
            <form onSubmit={handleSubmit(({data}) => {
                this.setState({loading: true})
                const success = () => {
                    if(this.props.onClose) this.props.onClose()
                    this.setState({loading: false})
                }
                dispatchSubmit({...data, assetName, errorCallback: this.errorCallback, issuer, success })
            })}
                  onChange={this.clearError}
            >
                <div className="row">
                    <div className="column small-2" style={{paddingTop: 5}}>{tt('g.from')}</div>
                    <div className="column small-10">
                        <div className="input-group" style={{marginBottom: "1.25rem"}}>
                            <span className="input-group-label">@</span>
                            <input
                                className="input-group-field bold"
                                type="text"
                                disabled
                                value={issuer.get('username')}
                            />
                        </div>
                    </div>
                </div>

               <div className="row">
                    <div className="column small-2" style={{paddingTop: 5}}>{tt('g.to')}</div>
                    <div className="column small-10">
                        <div className="input-group" style={{marginBottom: "1.25rem"}}>
                            <span className="input-group-label">@</span>
                            <input
                                className="input-group-field"
                                ref="to"
                                type="text"
                                placeholder={tt('transfer_jsx.send_to_account')}
                                onChange={this.onChangeTo}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                disabled={loading}
                                {...to.props}
                            />
                        </div>
                        {to.touched && to.blur && to.error && <div className="error">{to.error}&nbsp;</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="column small-2" style={{paddingTop: 5}}>{tt('g.amount')}</div>
                    <div className="column small-10">
                        <div className="input-group" style={{marginBottom: "1.25rem"}}>
                            <input type="text"
                                   placeholder={tt('g.amount')}
                                   {...amount.props} ref="amount"
                                   autoComplete="off" autoCorrect="off"
                                   autoCapitalize="off"
                                   spellCheck="false"
                                   disabled={loading}
                            />
                            <span className="input-group-label uppercase">{assetName}</span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="column small-2" style={{paddingTop: 5}}>{tt('g.memo')}</div>
                    <div className="column small-10">
                        {/*<small>{tt('transfer_jsx.this_memo_is') + isMemoPrivate ? tt('transfer_jsx.private'): tt('transfer_jsx.public')}</small>*/}
                        <input
                            type="text"
                            placeholder={tt('g.memo')}
                            {...memo.props}
                            ref="memo"
                            autoComplete="on"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            disabled={loading}
                        />
                        <div className="error">{memo.touched && memo.error && memo.error}&nbsp;</div>
                    </div>
                </div>
                {loading && <span><LoadingIndicator type="circle" /><br /></span>}
                {!loading && <span>
                    {trxError && <div className="error">{trxError}</div>}
                    <button type="submit" disabled={submitting || !valid} className="button">
                        {tt('asset_actions_jsx.submit')}
                    </button>
                </span>}
            </form>
        )
        return (
            <div>
                <div className="row">
                    <h3>{tt('asset_actions_jsx.title')}</h3>
                </div>
                {form}
            </div>
        )
    }
}

export default connect(

    (state, ownProps) => {
        const initialValues = {to: null};
        const issuer = state.user.getIn(['current']);

        return {...ownProps, issuer, initialValues}
    },

    dispatch => ({

        dispatchSubmit: ({ to, amount, assetName, memo, issuer, errorCallback, success}) => {
            const asset_to_issue = [parseFloat(amount, 10).toFixed(3), assetName].join(' ');

            const successCallback = () => {
                success();
                dispatch({type: 'ADD_NOTIFICATION', payload:
                    {
                        key: "asset_issue" + Date.now(),
                        message: tt('asset_actions_jsx.notification', {amount: asset_to_issue}),
                        dismissAfter: 5000
                    }
                })
            };

            const operation = {
                issuer: issuer.get('username'),
                asset_to_issue,
                issue_to_account: to,
                memo,
                extensions: [],
                __config: {title: tt('asset_actions_jsx.confirm_title')}
            };

            dispatch(transaction.actions.broadcastOperation({
                type: 'asset_issue',
                operation,
                confirm: tt('asset_actions_jsx.confirm_issue_asset', {amount: asset_to_issue}),
                successCallback,
                errorCallback
            }))
        }
    })
)(AssetActions)

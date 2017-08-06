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
import utils from 'app/utils/Assets/utils';

class AssetActions extends Component {

    static propTypes = {
        assetName:  PropTypes.string.isRequired,
        issuer: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired
    };

    constructor(props) {
        super();
        const { type } = props;
        this.state = {
            isIssue: type === 'asset_issue',
            isReserve: type === 'asset_reserve',
            isTransfer: type === 'asset_transfer'
        };
        this.initForm(props);
    }

    componentDidMount() {
        const { isReserve } = this.state
        setTimeout(() => {
            if (isReserve)
                ReactDOM.findDOMNode(this.refs.amount).focus()
            else
                ReactDOM.findDOMNode(this.refs.to).focus()
        }, 300)
        runTests()
    }

    initForm(props) {
		const { isIssue, isReserve } = this.state
        const { assets, assetName, } = props
        const fields = isReserve ? ['amount'] : ['to', 'amount', 'memo']

        const insufficientFunds = (amount) => {
			if (isIssue) {
				const currentSupply = assets.getIn([assetName, 'dynamic_data', 'current_supply']) / utils.get_asset_precision(3)
				const maxSupply = assets.getIn([assetName, 'options', 'max_supply']) / utils.get_asset_precision(3)
				return parseFloat(amount) > parseFloat(maxSupply - currentSupply)
			}

			const { assetsBalance } = props
			const balanceValue = assetsBalance.get(assetName)
			if(!balanceValue) return false
			const balance = balanceValue.split(' ')[0]
			return parseFloat(amount) > parseFloat(balance)
		}

        reactForm({
            name: 'transfer',
            instance: this, fields,
            initialValues: props.initialValues,
            validation: values => ({
                to:
                    !values.to ? tt('g.required') : validate_account_name(values.to),
                amount:
                  ! values.amount ? tt('g.required') :
                    ! /^[0-9]*\.?[0-9]*/.test(values.amount) ? tt('transfer_jsx.amount_is_in_form') :
						insufficientFunds(values.amount) ? tt('transfer_jsx.insufficient_funds')  : null,
                memo:
                    values.memo && (!browserTests.memo_encryption && /^#/.test(values.memo)) ?
                        'Encrypted memos are temporarily unavailable (issue #98)' :
                        null,
            })
        })
    }

	balanceValue() {
		if (this.state.isIssue ) {
			const { assets, assetName } = this.props
			const maxSupply = assets.getIn([assetName, 'options', 'max_supply']) / utils.get_asset_precision(3)
			const currentSupply = assets.getIn([assetName, 'dynamic_data', 'current_supply']) / utils.get_asset_precision(3)
			return [ parseFloat(maxSupply - currentSupply).toFixed(3), assetName ].join(' ')
		}

		const { assetsBalance, assetName } = this.props
		return assetsBalance.get(assetName)
	}

	assetBalanceClick = e => {
		e.preventDefault()
		this.state.amount.props.onChange(this.balanceValue().split(' ')[0])
	}

    clearError = () => {this.setState({ trxError: undefined })};

    errorCallback = estr => { this.setState({ trxError: estr, loading: false }) }

    onChangeTo = (e) => {
        const {value} = e.target
        this.state.to.props.onChange(value.toLowerCase().trim())
    };

    render() {
        const { to, amount, memo } = this.state;
        const { loading, trxError, isIssue, isReserve, isTransfer } = this.state;
        const { submitting, valid, handleSubmit } = this.state.transfer;
        const { issuer, assetName, type, dispatchSubmit } = this.props;

        const isMemoPrivate = memo && /^#/.test(memo.value);
        const isMemoPrivateText = isMemoPrivate ? tt('transfer_jsx.private'): tt('transfer_jsx.public');

        const form = (
            <form onSubmit={handleSubmit(({data}) => {
                this.setState({loading: true})
                const success = () => {
                    if(this.props.onClose) this.props.onClose()
                    this.setState({loading: false})
                }
                dispatchSubmit({...data, assetName, errorCallback: this.errorCallback, issuer, type, success })
            })}
                  onChange={this.clearError}
            >
                { !isReserve && <div className="row">
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
                </div>}

                { !isReserve && <div className="row">
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
                </div>}

                <div className="row">
                    <div className="column small-2" style={{paddingTop: 5}}>{tt('g.amount')}</div>
                    <div className="column small-10">
                        <div className="input-group" style={{marginBottom: "0.25rem"}}>
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

						<div style={{marginBottom: "0.6rem"}}>
							<AssetBalance
								balanceValue={this.balanceValue()}
								onClick={this.assetBalanceClick}
								title={isTransfer ? tt('transfer_jsx.balance'): tt('asset_actions_jsx.available')}
							/>
						</div>

                      {(amount.touched && amount.error)
                          ?
                            <div className="error">
                              {amount.touched && amount.error && amount.error}&nbsp;
                            </div>
                          :
                            null
                      }
                    </div>
                </div>

                { !isReserve && <div className="row">
                    <div className="column small-2" style={{paddingTop: 5}}>{tt('g.memo')}</div>
                    <div className="column small-10">
                        <small>{isMemoPrivateText}</small>
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
                </div>}
                {loading && <span><LoadingIndicator type="circle" /><br /></span>}
                {!loading && <span>
                    {trxError && <div className="error">{trxError}</div>}
                    <button type="submit" disabled={submitting || !valid} className="button">
                        { isReserve ? tt('asset_actions_jsx.issue_reserve_submit') :
                            isTransfer ? tt('asset_actions_jsx.issue_transfer_submit') :
                                tt('asset_actions_jsx.issue_asset_submit')}
                    </button>
                </span>}
            </form>
        )
        return (
            <div>
                <div className="row">
                    <h3>{ isReserve ? tt('asset_actions_jsx.issue_reserve_title') :
                        isTransfer ? tt('asset_actions_jsx.issue_transfer_title') :
                            tt('asset_actions_jsx.issue_asset_title')}</h3>
                </div>
                {form}
            </div>
        )
    }
}

const AssetBalance = ({onClick, balanceValue, title}) =>
	<a onClick={onClick} style={{borderBottom: '#A09F9F 1px dotted', cursor: 'pointer'}}>{title + ": " + balanceValue}</a>

export default connect(

    (state, ownProps) => {
        const initialValues = {to: null};
        const issuer = state.user.getIn(['current']);
        const assets = state.assets.get('issuer_assets');
        const accounts = state.global.get('accounts');
        const assetsBalance = accounts.getIn([issuer.get('username'), 'assets_balance']);

        return {...ownProps, issuer, initialValues, assetsBalance, assets}
    },

    dispatch => ({

        dispatchSubmit: ({ to, amount, assetName, memo, issuer, errorCallback, type, success}) => {
            const _amount = [parseFloat(amount).toFixed(3), assetName].join(' ');
			const username = issuer.get('username')

            const action =
                type === 'asset_issue' ?
                {
                    type,
                    operation: {
                        issuer: username,
                        asset_to_issue: _amount,
                        issue_to_account: to,
                        memo,
                        extensions: [],
                        __config: {title: tt('asset_actions_jsx.issue_asset_confirm_title')},
                    },
                    confirm: tt('asset_actions_jsx.issue_asset_confirm_body', {amount: _amount}),
                    message : tt('asset_actions_jsx.issue_asset_notification', {amount: _amount})
                }
                : type === 'asset_transfer' ?
                {
                    type: 'transfer',
                    operation: {
                    	from: username,
						to,
						amount: _amount,
						memo
                    }
                }
                :
                {
                    type, //asset_reserve
                    operation: {
                        payer: username,
                        amount_to_reserve: _amount,
                        extensions: [],
                        __config: {title: tt('asset_actions_jsx.issue_reserve_confirm_title')},
                    },
                    confirm: tt('asset_actions_jsx.issue_reserve_confirm_body', {amount: _amount}),
                    message : tt('asset_actions_jsx.issue_reserve_notification', {amount: _amount})
                };

            const successCallback = () => {
				success();
            	if (type === 'asset_transfer') {
					dispatch({type: 'global/GET_STATE', payload: {url: `@${username}/transfers`}})
				} else {
					dispatch({type: 'FETCH_ISSUER_ASSETS'})
					dispatch({
						type: 'ADD_NOTIFICATION', payload: {
							key: "asset_actions_" + Date.now(),
							message: action.message,
							dismissAfter: 5000
						}
					})
				}
            };

            dispatch(transaction.actions.broadcastOperation({
                type: action.type,
                operation: action.operation,
                confirm: action.confirm,
                successCallback,
                errorCallback
            }))
        }
    })
)(AssetActions)

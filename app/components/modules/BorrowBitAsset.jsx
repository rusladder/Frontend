import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import tt from 'counterpart'
import transaction from 'app/redux/Transaction'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'
import { validate_account_name } from 'app/utils/ChainValidation'
import { countDecimals } from 'app/utils/ParsersAndFormatters'
import utils from 'app/utils/Assets/utils'

class BorrowBitAsset extends Component {

	constructor(props) {
		super()
		this.state = this.initialState(props)
	}

	initialState(props) {
		let currentPosition = props ? this.getCurrentPosition(props) : {}
		let isPredictionMarket = this.isPredictionMarket(props.quote_asset)

		if (currentPosition.collateral) {
			let debt = utils.get_asset_amount(currentPosition.debt, props.quote_asset)
			let collateral = utils.get_asset_amount(currentPosition.collateral, props.backingAsset)

			return {
				short_amount: debt ? debt.toString() : null,
				collateral: collateral ? collateral.toString() : null,
				collateral_ratio: this.getCollateralRatio(debt, collateral),
				errors: this.getInitialErrors(),
				isValid: false,
				original_position: {
					debt: debt,
					collateral: collateral
				}
			}
		} else {
			return {
				short_amount: 0,
				collateral: 0,
				collateral_ratio: isPredictionMarket ? 1 : 0,
				errors: this.getInitialErrors(),
				isValid: false,
				original_position: {
					debt: 0,
					collateral: 0
				}
			}
		}
	}

	getInitialErrors() {
		return {
			collateral_balance: null,
			ratio_too_high: null
		};
	}

	onBorrowChange(e) {
		let feed_price = this.getFeedPrice()
		let amount = e.target.value

		let newState = {
			short_amount: amount,
			collateral: (this.state.collateral_ratio * (amount / feed_price)).toFixed(3), //backingAsset.precision
			collateral_ratio: this.state.collateral_ratio
		}

		this.setState(newState)
		this.validateFields(newState)
		this.setUpdatedPosition(newState)
	}

	onCollateralChange(e) {
		let amount = e.target.value
		let feed_price = this.getFeedPrice()

		let newState = this.isPredictionMarket(this.props.quote_asset) ? {
				short_amount: amount,
				collateral: amount,
				collateral_ratio: 1
			} : {
				short_amount: this.state.short_amount,
				collateral: amount,
				collateral_ratio: amount / (this.state.short_amount / feed_price)
			}

		this.setState(newState)
		this.validateFields(newState)
		this.setUpdatedPosition(newState)
	}

	onRatioChange(e) {
		let feed_price = this.getFeedPrice()
		let ratio = e.target.value

		let newState = {
			short_amount: this.state.short_amount,
			collateral: ((this.state.short_amount / feed_price) * ratio).toFixed(3), //backingAsset.precision
			collateral_ratio: ratio
		}

		this.setState(newState)
		this.validateFields(newState)
		this.setUpdatedPosition(newState)
	}

	setUpdatedPosition(newState) {
		this.setState({
			newPosition: (parseFloat(newState.short_amount) / parseFloat(newState.collateral))
		})
	}

	validateFields(newState) {
		let errors = this.getInitialErrors();
		let {original_position} = this.state;
		let backing_balance = !this.props.backingBalance ? {balance: 0} : this.props.backingBalance;

		if ( (parseFloat(newState.collateral)-original_position.collateral) > utils.get_asset_amount(backing_balance.balance, {precision: 3})) {
			errors.collateral_balance = tt('borrow_bitAsset_jsx.errors.collateral');
		}
		let isValid = (newState.short_amount >= 0 && newState.collateral >= 0) && (newState.short_amount != original_position.debt || newState.collateral != original_position.collateral);

		let mcr = this.props.quote_asset.getIn(["bitasset_data", "current_feed", "maintenance_collateral_ratio"]) / 1000;
		if (parseFloat(newState.collateral_ratio) < (this.isPredictionMarket(this.props.quote_asset) ? 1 : mcr)) {
			errors.below_maintenance = tt('borrow_bitAsset_jsx.errors.below', {mr: mcr});
			isValid = false;
		} else if (parseFloat(newState.collateral_ratio) < (this.isPredictionMarket(this.props.quote_asset) ? 1 : (mcr + 0.5))) {
			errors.close_maintenance = tt('borrow_bitAsset_jsx.errors.close', {mr: mcr});
			isValid = true;
		}

		this.setState({errors, isValid});
	}

	getCurrentPosition(props) {
		let currentPosition = {
			collateral: null,
			debt: null
		};

		if (props && /*props.hasCallOrders &&*/ props.callOrders) {
			for (let key in props.callOrders) {
				if (props.callOrders.hasOwnProperty(key) && props.callOrders[key]) {
					if (props.quoteAsset.get("id") === props.callOrders[key].getIn(["call_price", "quote", "asset_id"])) {
						currentPosition = props.callOrders[key].toJS();
					}
				}
			}
		}
		return currentPosition;
	}

	getFeedPrice() {
		if (!this.props) {
			return 1;
		}

		const { quote_asset } = this.props
		if (this.isPredictionMarket(quote_asset)) {
			return 1;
		}

		let sp_base = quote_asset.getIn(["bitasset_data", "current_feed", "settlement_price", "base"])
		let sp_quote = quote_asset.getIn(["bitasset_data", "current_feed", "settlement_price", "quote"])

		sp_base = sp_base.split(' ')
		sp_quote = sp_quote.split(' ')

		return 1 / utils.get_asset_price(
				sp_quote[0],
				{precision: 3},
				sp_base[0],
				quote_asset
			);
	}

	getCollateralRatio(debt, collateral) {
		return collateral / (debt / this.getFeedPrice());
	}

	isPredictionMarket(quoteAsset) {
		return quoteAsset.getIn(["bitasset_data", "is_prediction_market"]);
	}

	errorCallback = estr => { this.setState({ loading: false }) }

	handleSubmit(e) {
		e.preventDefault();

		const currentPosition = this.getCurrentPosition(this.props);

		this.setState({loading: true})
		const success = () => {
			if(this.props.onClose) this.props.onClose()
			this.setState({loading: false})
		}

		const collateral = [parseInt(this.state.collateral - currentPosition.collateral, 10).toFixed(3), 'GOLOS'].join(' ')
		const debt = [parseInt(this.state.short_amount - currentPosition.debt, 10).toFixed(3), this.props.quote_asset.get("asset_name")].join(' ')

		this.props.dispatchSubmit( this.props.userName, collateral, debt, this.errorCallback, success )
	}

	render() {
		const { quote_asset, bitassetBalance, backingBalance} = this.props
		const quoteAsset = quote_asset.toJS()
		const assetName = quoteAsset.asset_name
		const { short_amount, errors, isValid, loading} = this.state
		let { collateral_ratio } = this.state

		if (!collateral_ratio
			|| isNaN(collateral_ratio)
			|| !(collateral_ratio > 0.0 && collateral_ratio < 1000.0)) {
			collateral_ratio = 0
		}

		const feed_price = this.getFeedPrice()
		const maintenanceRatio = quote_asset.getIn(["bitasset_data", "current_feed", "maintenance_collateral_ratio"]) / 1000
		const isPredictionMarket = quoteAsset.bitasset_data.is_prediction_market

		if (!isPredictionMarket && isNaN(feed_price)) {
			return (
				<div className="row">
					<form noValidate>
						<h3> {tt('borrow_bitAsset_jsx.no_valid', { asset: assetName })} </h3>
					</form>
				</div>
			)
		}

		const form = (
			<form >
				<div className="row">
					<div className="column small-3" style={{paddingTop: 5}}>{tt('borrow_bitAsset_jsx.borrow_amount')}</div>
					<div className="column small-9">
						<div className="input-group" style={{marginBottom: "0.25rem"}}>
							<input type="text"
								   placeholder={tt('g.amount')}
								   ref="amount"
								   autoComplete="off" autoCorrect="off"
								   autoCapitalize="off"
								   spellCheck="false"
								   onChange={this.onBorrowChange.bind(this)}

							/>
							<span className="input-group-label uppercase">{assetName}</span>
						</div>
						<div style={{marginBottom: "0.6rem"}}>
							<span style={{borderBottom: '#A09F9F 1px dotted'}}>{tt('borrow_bitAsset_jsx.available') + ": " + bitassetBalance}</span>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="column small-3" style={{paddingTop: 5}}>{tt('borrow_bitAsset_jsx.collateral')}</div>
					<div className="column small-9">
						<div className="input-group" style={{marginBottom: "0.25rem"}}>
							<input type="text"
								   placeholder={tt('g.amount')}
								   ref="amount"
								   autoComplete="off" autoCorrect="off"
								   autoCapitalize="off"
								   spellCheck="false"
								   onChange={this.onCollateralChange.bind(this)}
							/>
							<span className="input-group-label uppercase">GOLOS</span>
						</div>
						<div style={{marginBottom: "0.6rem"}}>
							<span style={{borderBottom: '#A09F9F 1px dotted'}}>{tt('borrow_bitAsset_jsx.available') + ": " + backingBalance}</span>
						</div>
					</div>
				</div>

				{!isPredictionMarket
					? ( <div>
							<div className="row" style={{marginBottom: "1rem"}}>
								<div className="column small-3">
									<label>{tt('borrow_bitAsset_jsx.coll_ratio')}</label>
								</div>
								<div className="column small-9">
									<input
										min="0"
										max="6"
										step="0.05"
										type="range"
										value={collateral_ratio}
										disabled={!short_amount}
										onChange={this.onRatioChange.bind(this)}
									/>
									<div className="inline-block">{collateral_ratio}</div>

								</div>
							</div>
							<div className="row" style={{marginBottom: "1rem"}}>
								{errors.below_maintenance || errors.close_maintenance
									? <div className="warning">{errors.below_maintenance}{errors.close_maintenance}</div>
									: null
								}
							</div>
						</div>
					 )
					: null
				}
				{loading && <span><LoadingIndicator type="circle" /><br /></span>}
				{!loading && <button type="submit" className="button" onClick={this.handleSubmit.bind(this)} disabled={isValid}>
					{tt('borrow_bitAsset_jsx.adjust')}
				</button>}
			</form>
		)

		return (
			<div>
				<div className="row">
					<h3>{tt('borrow_bitAsset_jsx.title', { asset: assetName })}</h3>
				</div>
				<div className="row">
					<div className="column">
						<div style={{marginBottom: "1rem"}}>{tt('borrow_bitAsset_jsx.help.first', { debt: assetName })}</div>
						<div style={{marginBottom: "1rem"}}>{tt('borrow_bitAsset_jsx.help.second', { mr: maintenanceRatio })}</div>
					</div>
				</div>
				{!isPredictionMarket
					? (<div>
						<div className="row" style={{marginBottom: "1rem"}}>
							<div className="column">
								{tt('borrow_bitAsset_jsx.feed_price')}: {feed_price}
							</div>
					    </div>
						<div className="row" style={{marginBottom: "1rem"}}>
							<div className="column">
								<span className={" " + (errors.below_maintenance ? "error" : errors.close_maintenance ? "warning" : "")} >
									{tt('borrow_bitAsset_jsx.your_price')}:
								</span>
							</div>
					    </div>

					  </div>)
					: null
				}
				{form}
			</div>
		)
	}
}

export default connect(
	(state, ownProps) => {
		const userName = state.user.getIn(['current', 'username'])
		const account = state.global.getIn(['accounts', userName])
		const quote_asset = state.market.get('quote_asset')
		const bitassetBalance = account.getIn(['assets_balance', quote_asset.get('asset_name')]) || 0
		const backingBalance = account.get('balance')
		const callOrders = state.market.get('call_orders')

		return {
			...ownProps,
			userName,
			quote_asset,
			bitassetBalance,
			backingBalance,
			callOrders
		}
	},

	dispatch => ({
		dispatchSubmit: (account, collateral, debt, errorCallback, success ) => {

			const successCallback = () => {
				success();
				dispatch({type: 'FETCH_ISSUER_ASSETS'})
			}

			const operation = {
				"funding_account": account,
				"delta_collateral": collateral,
				"delta_debt": debt
			}

			dispatch(transaction.actions.broadcastOperation({
				type: "call_order_update",
				operation,
				successCallback,
				errorCallback
			}))
		}
	})

)(BorrowBitAsset)

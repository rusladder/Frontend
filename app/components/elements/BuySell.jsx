import React, { PropTypes, Component } from "react"
import { roundUp, roundDown, getBalance } from "app/utils/MarketUtils"
import tt from 'counterpart'
import { LIQUID_TICKER, DEBT_TICKER } from 'app/client_config'

export default class BuySell extends Component {

	static propTypes = {
		base: PropTypes.string,
		quote: PropTypes.string,
		price: PropTypes.number,
		type: PropTypes.oneOf(['bid', 'ask']),
		ticker: React.PropTypes.object,
		account: React.PropTypes.object,
		user: React.PropTypes.string,
		placeOrder: PropTypes.func.isRequired,
		reload: PropTypes.func.isRequired,
		notify: PropTypes.func.isRequired
	};

	static defaultProps = {
		type: 'bid'
	};

	constructor(props) {
		super(props);
		this.state = {
			base_quote: `${props.base}_${props.quote}`,
			buy_disabled: true,
			sell_disabled: true,
			buy_price_warning: false,
			sell_price_warning: false,
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.price) {
			const p = parseFloat(newProps.price)
			this.refs.price.value = p.toFixed(6)

			const isAsk = this.props.type === 'ask';
			if (isAsk) {
				const samount = parseFloat(this.refs.amount.value)
				if(samount >= 0) this.refs.total.value = roundDown(p * samount, 3)
			} else {
				const bamount = parseFloat(this.refs.amount.value)
				if(bamount >= 0) this.refs.total.value = roundUp(p * bamount, 3)
			}

			this.validate()
		}
	}

	percentDiff = (marketPrice, userPrice) => {
		marketPrice = parseFloat(marketPrice);
		return 100 * (userPrice - marketPrice) / (marketPrice)
	}

	validate = () => {
		const isAsk = this.props.type === 'ask';
		const amount = parseFloat(this.refs.amount.value)
		const price = parseFloat(this.refs.price.value)
		const total = parseFloat(this.refs.total.value)
		const valid = (amount > 0 && price > 0 && total > 0)

		if (isAsk) {
			const {lowest_ask} = this.props.ticker;
			this.setState({
				buy_disabled: !valid,
				buy_price_warning: valid && this.percentDiff(lowest_ask, price) > 15
			});
		} else {
			const {highest_bid} = this.props.ticker;
			this.setState({
				sell_disabled: !valid,
				sell_price_warning: valid && this.percentDiff(highest_bid, price) < -15
			});
		}
	}

	clearFields() {
		// this.refs.amount.value = ''
		// this.refs.price.value = ''
		// this.refs.total.value = ''
	}

	formSubmit = (e) => {
		e.preventDefault()
		const { base, quote, type, user, placeOrder, notify, reload } = this.props

		if(!user) return
		const isAsk = (type === 'ask');
		let amount_to_sell, min_to_receive, price
		if (isAsk) {
			amount_to_sell = parseFloat(this.refs.total.value)
			min_to_receive = parseFloat(this.refs.amount.value)
			price = (amount_to_sell / min_to_receive).toFixed(6)
			const {lowest_ask} = this.props.ticker

			placeOrder(false, user, `${amount_to_sell} ${base}`,`${min_to_receive} ${quote}`, `${quote} ${price}/${base}`,
				!!this.state.buy_price_warning, lowest_ask, (msg) => {
					notify(msg)
					reload(user, this.state.base_quote)
					this.clearFields()
			})
		} else {
			min_to_receive = parseFloat(this.refs.total.value)
			amount_to_sell = parseFloat(this.refs.amount.value)
			price = (min_to_receive / amount_to_sell).toFixed(6)
			const {highest_bid} = this.props.ticker

			placeOrder(true, user, `${amount_to_sell} ${quote}`, `${min_to_receive} ${base}`, `${quote} ${price}/${base}`,
				!!this.state.sell_price_warning, highest_bid, (msg) => {
					notify(msg)
					reload(user, this.state.base_quote)
					this.clearFields()
			})
		}
	}

	render() {
		const { validate } = this
		const { buy_disabled, sell_disabled, buy_price_warning, sell_price_warning } = this.state

		const { base, quote, type, account, ticker } = this.props

		const isAsk = (type === 'ask')
		const color = isAsk ? "buy-color" : "sell-color"

		const bestPrice =
			<div style={{marginTop: 5}}>
				<small>
					<a href="#"
					   onClick={e => {
							e.preventDefault()
							const amount = parseFloat(this.refs.amount.value)
							const price = parseFloat(isAsk ? ticker.lowest_ask : ticker.highest_bid)
							this.refs.price.value = isAsk ? ticker.lowest_ask : ticker.highest_bid
							if(amount >= 0)
								this.refs.total.value = isAsk ? roundUp(amount * price, 3).toFixed(3) : roundDown(parseFloat(price) * amount, 3)
							validate()
					   }
					}>
						{isAsk ? tt('market_jsx.lowest_ask') : tt('market_jsx.highest_bid')}:
					</a> {isAsk ? ticker.lowest_ask.toFixed(6) : ticker.highest_bid.toFixed(6)}
				</small>
			</div>

		const totalBalance = account && getBalance(account, base, quote, isAsk)
		const currentBalance = account &&
			<div>
				<small>
					<a href="#" onClick={e => {
						e.preventDefault();
						const price = parseFloat(this.refs.price.value)
						if (isAsk) {
							const total = totalBalance.split(' ')[0]
							this.refs.total.value = total
							if(price >= 0)
								this.refs.amount.value = roundDown(parseFloat(total) / price, 3).toFixed(3)
						} else {
							const amount = totalBalance.split(' ')[0]
							this.refs.amount.value = amount
							if(price >= 0)
								this.refs.total.value = roundDown(price * parseFloat(amount), 3)
						}
						validate()
					}}>{tt('market_jsx.available')}:</a> { totalBalance }
			</small>
			</div>

		return (
			<div className="BuySell">
				<div className="block-header">
					<div className="row">
						<div className="column small-6">
							<span className={"uppercase " + color} >
								{`${tt(isAsk ? 'g.buy' : 'g.sell')} ${quote}`}
							</span>
						</div>
					</div>
				</div>

				<form className="BuySell__orderform block-body" onSubmit={this.formSubmit.bind(this)}>

					<div className="row">
						<div className="column small-3 large-2">
							<label>{tt('g.price')}</label>
						</div>
						<div className="column small-9 large-9">
							<div className="input-group">
								<input
									id="price"
									className={'input-group-field' + (isAsk ? buy_price_warning ? ' price_warning' : '' : sell_price_warning ? ' price_warning' : '')}
									type="text"
									ref="price"
									placeholder="0.0"
									onChange={e => {
										const amount = parseFloat(this.refs.amount.value)
										const price  = parseFloat(this.refs.price.value)
										if(amount >= 0 && price >= 0)
											this.refs.total.value = isAsk ? roundUp(price * amount, 3) : roundDown(price * amount, 3)
										validate()
									}}
								/>
								<span className="input-group-label uppercase">{quote}/{base}</span>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="column small-3 large-2">
							<label>{tt('g.amount')}</label>
						</div>
						<div className="column small-9 large-9">
							<div className="input-group">
								<input
									className="input-group-field"
									type="text"
									ref="amount"
									placeholder="0.0"
									onChange={e => {
										const price = parseFloat(this.refs.price.value)
										const amount = parseFloat(this.refs.amount.value)
										if(price >= 0 && amount >= 0)
											this.refs.total.value = isAsk ? roundUp(price * amount, 3) : roundDown(price * amount, 3)
										validate()
									}}
								/>
								<span className="input-group-label uppercase">{quote}</span>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="column small-3 large-2">
							<label>{tt('market_jsx.total')}</label>
						</div>
						<div className="column small-9 large-9">
							<div className="input-group">
								<input
									className="input-group-field"
									type="text"
									ref="total"
									placeholder="0.0"
									onChange={e => {
										const price = parseFloat(this.refs.price.value)
										const total = parseFloat(this.refs.total.value)
										if(total >= 0 && price >= 0)
											this.refs.amount.value = roundUp(total / price, 3)
										validate()
									}}
								/>
								<span className="input-group-label">{base}</span>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="column small-7">
							{currentBalance}
							{bestPrice}
						</div>
						<div className="column small-4">
							<input
								disabled={isAsk
									? buy_disabled
									: sell_disabled
								}
								type="submit"
								className={"button hollow float-right uppercase " + color}
								value={isAsk
									? tt('navigation.buy_LIQUID_TOKEN', {LIQUID_TOKEN: quote})
									: tt('navigation.sell_LIQUID_TOKEN', {LIQUID_TOKEN: quote})
								}
							/>
						</div>
					</div>
				</form>
			</div>
		)
	}

}


import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import g from 'app/redux/GlobalReducer'
import transaction from 'app/redux/Transaction'
import TransactionError from 'app/components/elements/TransactionError'
import DepthChart from 'app/components/elements/DepthChart'
import Orderbook from 'app/components/elements/Orderbook'
import OrderHistory from 'app/components/elements/OrderHistory'
import { TradeHistory } from 'app/utils/MarketClasses'
import { roundUp, roundDown } from 'app/utils/MarketUtils'
import { normalizeOrders, aggOrders } from 'app/utils/OrdersUtils'
import { Tabs, Tab } from 'app/components/elements/Tabs'
import BuySell from 'app/components/elements/BuySell'
import OpenOrdersTable from 'app/components/elements/OpenOrdersTable'
import TickerPriceStat from 'app/components/elements/TickerPriceStat'
import tt from 'counterpart'
import { LIQUID_TICKER, DEBT_TICKER } from 'app/client_config'

class Market1 extends React.Component {

	static propTypes = {
        orderbook: React.PropTypes.object,
        open_orders: React.PropTypes.array,
        ticker: React.PropTypes.object,
        placeOrder: React.PropTypes.func.isRequired,
        user: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
        	base_quote: `${LIQUID_TICKER}_${DEBT_TICKER}`,
			price: 0.0,
            buy_disabled: true,
            sell_disabled: true,
            buy_price_warning: false,
            sell_price_warning: false
        };
    }

    componentWillMount() {
    	const { base_quote } = this.props.params
		if (base_quote) {
    		this.setState({ base_quote })
		}
	}

    componentWillReceiveProps(np) {
        // if (!this.props.ticker && np.ticker) {
        //     const {lowest_ask, highest_bid} = np.ticker;
        //     if (this.refs.buySteem_price) this.refs.buySteem_price.value = parseFloat(lowest_ask).toFixed(6);
        //     if (this.refs.sellSteem_price) this.refs.sellSteem_price.value = parseFloat(highest_bid).toFixed(6);
        // }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
      if( this.props.user !== nextProps.user && nextProps.user
		  && this.state.base_quote !== nextState.base_quote) {
          this.props.reload(nextProps.user, nextProps.base_quote)
      }

      if( nextState.buy_disabled != this.state.buy_disabled ||
          nextState.sell_disabled != this.state.sell_disabled) {
          return true
      }

      if( nextState.buy_price_warning != this.state.buy_price_warning ||
          nextState.sell_price_warning != this.state.sell_price_warning) {
          return true
      }

      let tc = (typeof this.props.ticker == 'undefined') ||
          (this.props.ticker.latest !== nextProps.ticker.latest) ||
          (this.props.ticker.sbd_volume !== nextProps.ticker.sbd_volume)

      let bc = (typeof this.props.orderbook == 'undefined') ||
          (this.props.orderbook['asks'].length != nextProps.orderbook['asks'].length) ||
          (this.props.orderbook['bids'].length != nextProps.orderbook['bids'].length)

      let oc = (typeof nextProps.open_orders !== undefined) && (
          typeof this.props.open_orders == 'undefined' ||
          JSON.stringify(this.props.open_orders) != JSON.stringify(nextProps.open_orders))

		let p = this.state.price !== nextState.price
      // Update if ticker info changed, order book changed size, or open orders length changed.
      //if(tc || bc || oc) console.log("tc?", tc, "bc?", bc, "oc?", oc)
      return tc || bc || oc || p;
    }

    cancelOrderClick = (e, orderid) => {
        e.preventDefault()
        const {cancelOrder, user} = this.props
        if(!user) return
        cancelOrder(user, orderid, (msg) => {
            this.props.notify(msg)
            this.props.reload(user, this.state.base_quote)
        })
    }

    setFormPrice = (price) => {
		this.setState({price})
    }

	// move to BuySell
	showBorrowDialog = () => {
		this.props.borrowBitasset()
	}

    render() {
		const account = this.props.account ? this.props.account.toJS() : null;
        const { cancelOrderClick, setFormPrice } = this
        const { base_quote, price } = this.state

		const { isMarketAsset, quoteAsset } = this.props

		let orderbook = aggOrders(normalizeOrders(this.props.orderbook));
		
		const [ base, quote ] = base_quote.split('_')

        function trade_history_table(trades) {
            if (!trades || !trades.length) {
                return [];
            }
            return <OrderHistory history={trades} base={base} quote={quote} />
		}
		
		let ticker = {
            latest:         0,
            lowest_ask:     0,
            highest_bid:    0,
            percent_change: 0,
			base_volume:    0,
			quote_volume:   0
        };

        return (
            <div>
                <div className="row">
                    <div className="column small-8">
                       <Tabs>
						
                            <Tab title="Depth Chart">
								<DepthChart
									base={base}
									quote={quote}
									bids={orderbook.bids}
									asks={orderbook.asks}
									precision={3}
								/>
                          </Tab>

                        </Tabs>
                    </div>
                    <div className="column small-4">
                        <TickerPriceStat ticker={ticker} assetName={quote} />
                    </div>
                </div>

                <div className="row">
                    <div className="column small-12">
                        <TransactionError opType="limit_order_create" />
                    </div>
                </div>
                  <div className="row">
                    <div className="column small-12">
                        {/*<Tabs>
                            <Tab title="Limit Order">*/}
								<div className="row">

									<div className="small-12 medium-6 columns">
										<BuySell
											base={base}
											quote={quote}
											type="ask"
											ticker={ticker}
											account={account}
											owner={this.props.user}
											placeOrder={this.props.placeOrder.bind(this)}
											reload={this.props.reload.bind(this)}
											notify={this.props.notify.bind(this)}
											price={price}
											quoteAsset={quoteAsset}
										/>
									</div>

									<div className="small-12 medium-6 columns">
										<BuySell
											base={base}
											quote={quote}
											type="bid"
											ticker={ticker}
											account={account}
											owner={this.props.user}
											placeOrder={this.props.placeOrder.bind(this)}
											reload={this.props.reload.bind(this)}
											notify={this.props.notify.bind(this)}
											price={price}
											quoteAsset={quoteAsset}
											isMarketAsset={isMarketAsset}
											showBorrowDialog={this.showBorrowDialog.bind(this)}
										/>
									</div>

								</div>
                 			{/*</Tab>

                            <Tab title="Market Order">
								<p>Market Order</p>
                            </Tab>
                        </Tabs>*/}
                    </div>
                </div>

                <div className="row show-for-medium">

                    <div className="small-6 columns">
						<div className="block-header">
							<span className="uppercase buy-color">{tt('market_jsx.buy_orders')}</span>
						</div>
                        <div className="block-body">
							<Orderbook
								side={"asks"}
								orderbook={orderbook}
								base={base}
								quote={quote}
								onClick={(price) => {
									setFormPrice(price)
								}}
							/>
						</div>
                    </div>

                    <div className="small-6 columns">
						<div className="block-header">
							<span className="uppercase sell-color">{tt('market_jsx.sell_orders')}</span>
						</div>
						<div className="block-body">
							<Orderbook
								side={"bids"}
								orderbook={orderbook}
								base={base}
								quote={quote}
								onClick={(price) => {
									setFormPrice(price)
								}}
							/>
						</div>
                    </div>

                </div>

                <div className="row ">
                    <div className="small-12 column">
						<div className="block-header">
							<span className="uppercase">{tt('market_jsx.trade_history')}</span>
						</div>
						<div className="block-body">
                        	{trade_history_table(this.props.history)}
						</div>

                    </div>
                </div>

                {account &&
                    <div className="row">
                        <div className="column">
							<div className="block-header">
								<span className="uppercase">{tt('market_jsx.open_orders')}</span>
							</div>
							<div className="block-body">
								<div  style={{marginRight: "1rem"}}>
									<OpenOrdersTable
										openOrders={this.props.open_orders}
										cancelOrder={cancelOrderClick}
									/>
								</div>
							</div>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

const DEFAULT_EXPIRE = 0xFFFFFFFF//Math.floor((Date.now() / 1000) + (60 * 60 * 24)) // 24 hours

module.exports = {
    path: 'market(/:base_quote)',
    component: connect(
    	state => {
			const user = state.user.get('current') ? state.user.get('current').get('username') : null
			const orderbook = state.market.get('orderbook')
			const open_orders = process.env.BROWSER ? state.market.get('open_orders') : []
			const ticker = state.market.get('ticker')
			const quoteAsset = state.market.get('quote_asset')
			const account = state.global.getIn(['accounts', user])
			const history = state.market.get('history')
			const feed = state.global.get('feed_price').toJS()
			const isMarketAsset = state.market.get('quote_asset') ? state.market.get('quote_asset').get('market_issued') : null

			return {
				orderbook,
				open_orders,
				ticker,
				quoteAsset,
				account,
				history,
				user,
				feed,
				isMarketAsset
			}
    	},

		dispatch => ({

			notify: (message) => {
				dispatch({type: 'ADD_NOTIFICATION', payload:
					{key: "mkt_" + Date.now(),
					 message: message,
					 dismissAfter: 5000}
				});
			},

			reload: (username, base_quote) => {
			  dispatch({type: 'market/UPDATE_MARKET', payload: {username: username, base_quote}})
			},

			cancelOrder: (owner, order_id, successCallback) => {
				const confirm = tt('market_jsx.order_cancel_confirm', {order_id, user: owner})
				const successMessage = tt('market_jsx.order_cancelled', {order_id})

				dispatch(transaction.actions.broadcastOperation({
				    type: 'limit_order_cancel',
					operation: {
				    	owner,
						order_id // orderid for 0.16
						//, __config: {successMessage}
				    },
					confirm,
					successCallback: () => { successCallback(successMessage) }
				}))
			},

			placeOrder: (isSell, owner, amount_to_sell, min_to_receive, effectivePrice, priceWarning,
				marketPrice, successCallback, fill_or_kill = false, expiration = DEFAULT_EXPIRE) => {
		
				const order_id = Math.floor(Date.now() / 1000)
				const confirmStr = tt(isSell
									? 'market_jsx.sell_amount_for_atleast'
									: 'market_jsx.buy_atleast_amount_for',
									{ amount_to_sell, min_to_receive, effectivePrice })
				const successMessage = tt('g.order_placed') + ': ' + confirmStr
	
				dispatch(transaction.actions.broadcastOperation({
					type: 'limit_order_create',
					operation: {
						owner,
						order_id, //for 0.16 use orderid
						amount_to_sell,
						min_to_receive,
						fill_or_kill,
						expiration
					},
					confirm: confirmStr + '?',
					successCallback: () => { successCallback(successMessage) }
				}))
			},

			borrowBitasset: () => {
				dispatch(g.actions.showDialog({name: 'borrowBitAsset', params: {}}));
			}
		})
    )(Market1)
};

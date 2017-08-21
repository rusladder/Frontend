import React, { PropTypes, Component } from "react"
import OrderbookRow from "./OrderbookRow";
import tt from 'counterpart';
import { DEBT_TOKEN_SHORT } from 'app/client_config';
import {Order} from "app/utils/MarketClasses";

export default class Orderbook extends Component {

	static propTypes = {
		base: PropTypes.string.isRequired,
		quote: PropTypes.string.isRequired,
	}

    constructor() {
        super();

        this.state = {
            buyIndex: 0,
            sellIndex: 0,
            animate: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
            	animate: true
            });
        }, 2000);
    }

    _setBuySellPage(back) {

        const indexKey = this.props.side === "bids" ? "buyIndex" : "sellIndex";

        let newIndex = this.state[indexKey] + (back ? 10 : -10);

        newIndex = Math.min(Math.max(0, newIndex), this.props.orders.length - 10);

        let newState = {};
        newState[indexKey] = newIndex;
        // Disable animations while paging
        if (newIndex !== this.state[indexKey]) {
            newState.animate = false;
        }
        // Reenable animatons after paging complete
        this.setState(newState, () => {
            this.setState({animate: true})
        });
    }

    renderOrdersRows(ordersbook, side) {
        const buy = side === "bids"
		const orders = buy ? ordersbook.asks : ordersbook.bids
        if (!orders.length) {
            return null
        }
        const { buyIndex, sellIndex } = this.state

        let total = 0
        return orders
        .map((order, index) => {
            total += order.getQuoteAmount()
            if (index >= (buy ? buyIndex : sellIndex) && index < ((buy ? buyIndex : sellIndex) + 10)) {
                return (
                    <OrderbookRow
                        onClick={this.props.onClick}
                        animate={this.state.animate}
                        key={side + order.getStringQuote() + order.getStringPrice()}
                        index={index}
                        order={order}
                        side={side}
                        total={total}
                    />
                );
            }
            return null;

        }).filter(a => {
            return !!a
        })

    }

	// Take raw orders from API and put them into a format that's clean & useful
	normalizeOrders(orders) {
		if(typeof orders == 'undefined') return {'bids': [], 'asks': []}
		return ['bids', 'asks'].reduce( (out, side) => {
			out[side] = orders[side].map( o => {
				return new Order(o, side)
			});
			return out
		}, {})
	}

	 aggOrders(orders) {
		return ['bids', 'asks'].reduce( (out, side) => {

			var buff = [], last = null
			orders[side].map( o => {
				if(last !== null && o.getStringPrice() === last.getStringPrice()) {
					buff[buff.length-1] = buff[buff.length-1].add(o);
				} else {
					buff.push(o)
				}
				last = o
			});

			out[side] = buff
			return out
		}, {})
	}

    render() {
        const { base, quote, side } = this.props
        const { buyIndex, sellIndex } = this.state
        const buy = side === "bids"

		let orderbook = this.aggOrders(this.normalizeOrders(this.props.orderbook));

        const currentIndex = buy ? buyIndex : sellIndex;
        return (
            <div style={{marginRight: "1rem"}}>
                <table className="Market__orderbook">
					<thead>
					<tr>
						<th>{buy ? `Total(${quote})` : tt('g.price')}</th>
						<th>{buy ? `${quote}` : `${base}`}</th>
						<th>{buy ? `${base}` : `${quote}`}</th>
						<th>{buy ? tt('g.price') : `Total(${quote})`}</th>
					</tr>
					</thead>
                    <tbody>
                            {this.renderOrdersRows(orderbook, side)}
                    </tbody>
                </table>
                <nav>
                  <ul className="pager">
                    <li>
                        <div className={"button tiny hollow " + (buy ? "float-left" : "float-left") + (currentIndex === 0 ? " disabled" : "")} onClick={this._setBuySellPage.bind(this, false)} aria-label="Previous">
                            <span aria-hidden="true">&larr; {tt(buy ? 'market_jsx.higher' : 'market_jsx.lower')}</span>
                        </div>
                    </li>
                    <li>
                        <div className={"button tiny hollow " + (buy ? "float-right" : "float-right") + (currentIndex >= 10 ? " disabled" : "")} onClick={this._setBuySellPage.bind(this, true)} aria-label="Next">
                            <span aria-hidden="true">{tt(buy ? 'market_jsx.lower' : 'market_jsx.higher')} &rarr;</span>
                        </div>
                    </li>
                  </ul>
                </nav>
            </div>

        )
    }
}

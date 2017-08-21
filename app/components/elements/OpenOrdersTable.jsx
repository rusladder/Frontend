import React, { Component, PropTypes } from "react";
import tt from 'counterpart'

export default class OpenOrdersTable extends Component {

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.openOrders !== this.props.openOrders
		);
	}

	render() {
		const { openOrders, cancelOrder } = this.props

		const rows = openOrders && openOrders.map( o =>
				<tr key={o.order_id}>
					<td>{o.created.replace('T', ' ')}</td>
					<td>{parseFloat(o.real_price).toFixed(6)}</td>
					<td>{o.sell_price.base}</td>
					<td>{o.sell_price.quote}</td>
					<td>
						<a href="#"
						   onClick={e =>
							   cancelOrder(e, o.order_id)}
						>
							{tt('g.cancel')}
						</a>
					</td>
				</tr> )
		return (
			<table className="Market__open-orders" >
				<thead>
				<tr>
					<th>{tt('market_jsx.date_created')}</th>
					<th>{tt('g.price')}</th>
					<th className="uppercase">Base</th>
					<th className="uppercase">Quote</th>
					<th>{tt('market_jsx.action')}</th>
				</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		)
	}
}
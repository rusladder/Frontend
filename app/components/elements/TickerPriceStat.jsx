import React, { Component } from 'react';
import tt from 'counterpart';

export default class TickerPriceStat extends Component {

    render() {
        const { ticker, assetName } = this.props;

        const pct_change = <span className={'Market__ticker-pct-' + (ticker.percent_change < 0 ? 'down' : 'up')}>
                {ticker.percent_change < 0 ? '' : '+'}{ticker.percent_change.toFixed(3)}%
              </span>
        return (
            <div className="TickerPriceStat">
                <div className="block-header">
					<span>{assetName}</span>
				</div>
				<div className="price-stat block-body">
					<div>
						<b>{tt('market_jsx.last_price')} </b>
						<span>{ticker.latest.toFixed(6)} ({pct_change})</span>
					</div>
					<div>
						<b>{tt('market_jsx.24h_volume')} </b>
						<span>{/*ticker.quote_volume.toFixed(2)*/}</span>
					</div>
					<div>
						<b>{tt('g.bid')} </b>
						<span>{ticker.highest_bid.toFixed(6)}</span>
					</div>
					<div>
						<b>{tt('g.ask')} </b>
						<span>{ticker.lowest_ask.toFixed(6)}</span>
					</div>
					{ticker.highest_bid > 0 && <div>
						<b>{tt('market_jsx.spread')} </b>
						<span>{(200 * (ticker.lowest_ask - ticker.highest_bid) / (ticker.highest_bid + ticker.lowest_ask)).toFixed(3)}%</span>
					</div> }
				</div>
            </div>
        );
    }
}

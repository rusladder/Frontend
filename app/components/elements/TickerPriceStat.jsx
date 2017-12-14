import React, { Component, PropTypes } from 'react';
import {roundUp, roundDown} from 'app/utils/MarketUtils';
import tt from 'counterpart';

export default class TickerPriceStat extends Component {

  	static propTypes = {
		account: PropTypes.string,
		ticker: PropTypes.object.isRequired,
	}

    constructor() {
        super()
        this.state = {}
    }

    render() {
		const { assetName } = this.props;
		let ticker = {
            latest:         0,
            lowest_ask:     0,
            highest_bid:    0,
            percent_change: 0,
			base_volume:    0,
			quote_volume:   0
        };


        if(typeof this.props.ticker != 'undefined') {
            let { latest, lowest_ask, highest_bid, percent_change, base_volume, quote_volume } = this.props.ticker;
            // let { base, quote } = this.props.feed
            ticker = {
                latest:         parseFloat(latest),
                lowest_ask:     roundUp(parseFloat(lowest_ask), 6),
                highest_bid:    roundDown(parseFloat(highest_bid), 6),
                percent_change: parseFloat(percent_change),
				quote_volume:     (parseFloat(quote_volume)),
                // feed_price:     parseFloat(base.split(' ')[0]) / parseFloat(quote.split(' ')[0])
				base_volume: (parseFloat(base_volume)),
            }
        }

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

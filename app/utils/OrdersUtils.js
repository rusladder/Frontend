import { Order } from 'app/utils/MarketClasses'

export const power = 100;

// Take raw orders from API and put them into a format that's clean & useful
export function normalizeOrders(orders) {
    if(typeof orders == 'undefined') return {'bids': [], 'asks': []}
    return ['bids', 'asks'].reduce( (out, side) => {
        out[side] = orders[side].map( o => {
            return new Order(o, side)
        });
        return out
    }, {})
}

export function aggOrders(orders) {
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

function orderEqual(a, b) {
    return (
        a.getPrice() === b.getPrice() &&
        a.getBaseAmount() === b.getBaseAmount() &&
        a.getQuoteAmount() === b.getQuoteAmount()
    );
}

export function ordersEqual(a, b) {
    if (a.length !== b.length) {
        return false
    }

    for (let key in a) {
        if(!(key in b) || !orderEqual(a[key], b[key])) {
            return false
        }
    }

    for (let key in b) {
        if(!(key in a) || !orderEqual(a[key], b[key])) {
            return false
        }
    }

    return true
}

export function generateBidAsk(bidsArray, asksArray) {
    
    // Input raw orders (from TOP of order book DOWN), output grouped depth
    function aggregateOrders(orders) {
        if(typeof orders == 'undefined') {
            return []
        }

        let total = 0
        return orders.map( o => {
            total += o.getQuoteAmount()
            return [o.getPrice() * power, total]
        }).sort((a, b) => { // Sort here to make sure arrays are in the right direction for HighCharts
            return a[0] - b[0]
        });
    }

    let bids = aggregateOrders(bidsArray)
    // Insert a 0 entry to make sure the chart is centered properly
    bids.length && bids.unshift([0, bids[0][1]])

    let asks = aggregateOrders(asksArray)
    // Insert a final entry to make sure the chart is centered properly
    asks.length && asks.push([asks[asks.length - 1][0] * 4, asks[asks.length - 1][1]])

    return { bids, asks }
}

export function getMinMax(bids, asks) {
    const highestBid = bids.length ? bids[bids.length-1][0] : 0
    const lowestAsk = asks.length ? asks[0][0] : 1

    const firstBid = bids.length ? bids[0][0] : 0
    const lastAsk  = asks.length ? asks[asks.length-1][0] : 0

    const middle = (highestBid + lowestAsk) / 2

    return {
        min: Math.max(middle * 0.65, firstBid),
        max: Math.min(middle * 1.35, lastAsk)
    }
}
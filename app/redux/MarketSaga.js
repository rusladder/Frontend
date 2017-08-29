import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import MarketReducer from './MarketReducer'
import { api } from 'golos-js'
import { getAccount } from './SagaShared';
import { fromJS } from 'immutable'
import { fetchAsset } from './AssetsSaga'
import { isMarketAsset } from 'app/utils/MarketUtils'
import { LIQUID_TICKER, DEBT_TICKER } from 'app/client_config'

export const marketWatches = [watchLocationChange, watchUserLogin, watchMarketUpdate]

const wait = ms => (
    new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    }))

let polling = false

export function* fetchMarket(location_change_action) {
    const { pathname } = location_change_action.payload

	if (pathname && pathname.indexOf('/market') == -1) {
        polling = false
        return
    }

    if (polling == true) return
    polling = true

	let base, quote

	const match = pathname.match(/^\/market\/?(?:([\w\d.]+)_([\w\d.]+))?/)
	if (match.length === 3) {
		base = match[1] ? match[1] : LIQUID_TICKER
		quote = match[2] ? match[2] : DEBT_TICKER
	}

	let asset =	yield call(fetchAsset, quote)
	if (!asset) return

	yield put(MarketReducer.actions.setQuoteAsset(asset))

  	const isma = isMarketAsset(asset, fromJS({asset_name: base}))
	if (isma.isMarketAsset) {
		//fetchCallOrders
		//fetchSettleOrders
	}

    while (polling) {
        try {

            const orderBook = yield call([api, api.getOrderBook], base, quote, 49)
            yield put(MarketReducer.actions.receiveOrderbook(orderBook))

			let startDate = new Date()
			let endDate = new Date()
			endDate.setDate(endDate.getDate() - 1)

            const tradeHistory = yield call([api, api.getTradeHistoryAsync], base, quote,
				startDate.toISOString().slice(0, -5), endDate.toISOString().slice(0, -5), 25)
            yield put(MarketReducer.actions.receiveTradeHistory(tradeHistory))

            const ticker = yield call([api, api.getTickerAsync], base, quote)
            yield put(MarketReducer.actions.receiveTicker(ticker))

        } catch (error) {
            console.error('~~ Saga fetchMarket error ~~>', error)
            yield put({type: 'global/CHAIN_API_ERROR', error: error.message})
        }

        yield call(wait, 3000)
    }
}

export function* fetchOpenOrdersByOwner(set_user_action) {
    const { username } = set_user_action.payload

    try {
       const openOrders = yield call([api, api.getLimitOrdersByOwner], username);
       yield put(MarketReducer.actions.receiveOpenOrders(openOrders));
       yield call(getAccount, username, true);
    } catch (error) {
        console.error('~~ Saga fetchOpenOrdersByOwner error ~~>', error)
        yield put({type: 'global/CHAIN_API_ERROR', error: error.message})
    }
}

export function* fetchCallOrders(username) {
	const callOrders = yield call([api, api.getCallOrdersByOwner], username)
	yield put(MarketReducer.actions.receiveCallOrders(callOrders))
}

export function* fetchSettleOrders(assetName) {
	const settleOrders = yield call([api, api.getSettleOrdersAsync], quote, 200)

}

export function* fetchMarketHistory(base, quote) {
	const bucketSize = 86400
	const marketHistory = yield call([api, api.getMarketHistoryAsync], base, quote, bucketSize,
		startDate.toISOString().slice(0, -5), endDate.toISOString().slice(0, -5), 25)

}

export function* reloadMarket(reload_action) {
    yield fetchMarket(reload_action)
    yield fetchOpenOrdersByOwner(reload_action)
	yield fetchCallOrders(reload_action.payload.username)
}

export function* watchUserLogin() {
    yield* takeLatest('user/SET_USER', fetchOpenOrdersByOwner)
}

export function* watchLocationChange() {
    yield* takeLatest('@@router/LOCATION_CHANGE', fetchMarket)
}

export function* watchMarketUpdate() {
    yield* takeLatest('market/UPDATE_MARKET', reloadMarket)
}

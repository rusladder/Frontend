import { LIQUID_TICKER, DEBT_TICKER } from 'app/client_config'

export function roundUp(num, precision) {
    let satoshis = parseFloat(num) * Math.pow(10, precision)

    // Attempt to correct floating point: 1.0001 satoshis should not round up.
    satoshis = satoshis - 0.0001

    // Round up, restore precision
    return Math.ceil(satoshis) / Math.pow(10, precision)
}

export function roundDown(num, precision) {
    let satoshis = parseFloat(num) * Math.pow(10, precision)

    // Attempt to correct floating point: 1.9999 satoshis should not round down.
    satoshis = satoshis + 0.0001

    // Round down, restore precision
    return Math.floor(satoshis) / Math.pow(10, precision)
}

export function isMarketAsset(quote, base) {
	let isMarketAsset = false, marketAsset, inverted = false;

	if (quote.get("bitasset") && base.get("id") === quote.getIn(["bitasset", "options", "short_backing_asset"])) {
		isMarketAsset = true;
		marketAsset = {id: quote.get("id")};
	} else if (base.get("bitasset") && quote.get("id") === base.getIn(["bitasset", "options", "short_backing_asset"])) {
		inverted = true;
		isMarketAsset = true;
		marketAsset = {id: base.get("id")};
	}

	return {
		isMarketAsset,
		marketAsset,
		inverted
	};
}

export function getBalance(account, base, quote, isAsk) {
	if (base === LIQUID_TICKER && quote === DEBT_TICKER) {
		return isAsk
			? account.balance
			: account.sbd_balance
	}

	return isAsk
		? account.balance
		: account.assets_balance[quote]
}

import { takeLatest, takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { fromJS, Map } from 'immutable'
import big from "bignumber.js";
import AssetsReducer from './AssetsReducer';
import transaction from 'app/redux/Transaction';
import utils from 'app/utils/Assets/utils';
import assetConstants from "app/utils/Assets/Constants";

import { api } from 'golos-js';

import {getAssets} from 'app/utils/Assets/assets_fake_data';

export const assetsWatches = [
    watchLocationChange,
    watchGetAsset,
    watchGetCoreAsset,
    watchCreateAsset,
    watchUpdateAsset,
    watchIssueAsset,
    watchReserveAsset
];

export function* watchLocationChange() {
    yield* takeLatest('@@router/LOCATION_CHANGE', fetchAssets);
}

export function* watchGetAsset() {
    yield* takeEvery('GET_ASSET', getAsset);
}

export function* watchGetCoreAsset() {
    yield* takeLatest('GET_CORE_ASSET', getCoreAsset);
}

export function* watchCreateAsset() {
    yield* takeLatest('CREATE_ASSET', createAsset);
}

export function* watchUpdateAsset() {
    yield* takeLatest('UPDATE_ASSET', updateAsset);
}

export function* watchIssueAsset() {
    yield* takeLatest('ISSUE_ASSET', issueAsset);
}

export function* watchReserveAsset() {
    yield* takeLatest('RESERVE_ASSET', reserveAsset);
}

export function* getCoreAsset(){
    let coreAsset = yield call([api, api.getAssetsAsync], ['GOLOS']);
    // const dynamicData = yield call([api, api.getAssetsDynamicDataAsync], ['GOLOS']);
    coreAsset = fromJS(coreAsset[0]);
    // coreAsset = coreAsset.set('dynamic_data', fromJS(dynamicData[0]))
    yield put(AssetsReducer.actions.receiveCoreAsset(coreAsset));
}

export function* fetchAssets(location_change_action) {
    const {pathname} = location_change_action.payload;

    if (pathname && pathname.indexOf('/assets') == -1) {
        return
    }

    const assets = getAssets();

    // const assets  = yield call([api, api.listAssetsAsync], 'A', 100);
    yield put(AssetsReducer.actions.receiveAssets(assets));
}

export function* getAsset({payload: {assetName}}) {
    let asset  = yield call([api, api.lookupAssetSymbols], [assetName]);
    asset = fromJS(asset[0]);
    yield put(AssetsReducer.actions.setReceivedAsset(asset));
}

export function* createAsset({payload: {
    account, createObject, flags, permissions, coreExchangeRate, isBitAsset, isPredictionMarket,
    bitassetOpts, description, successCallback, errorCallback}}) {

    const precision = utils.get_asset_precision(createObject.precision);
    big.config({DECIMAL_PLACES: createObject.precision});
    let max_supply = (new big(createObject.max_supply)).times(precision).toString();
    let max_market_fee = (new big(createObject.max_market_fee || 0)).times(precision).toString();

    const createAssetObject = {
        fee:  assetConstants.ASSET_DEFAULT_FEE,
        issuer: account,
        asset_name: createObject.symbol,
        precision: parseInt(createObject.precision, 10),
        common_options: {
            max_supply: max_supply,
            market_fee_percent: createObject.market_fee_percent * 100 || 0,
            max_market_fee: max_market_fee,
            issuer_permissions: permissions,
            flags: flags,
            core_exchange_rate: {
                base:  utils.formatCer(coreExchangeRate.base, 3),
                quote: utils.formatCer(coreExchangeRate.quote, parseInt(createObject.precision, 10))
            },
            whitelist_authorities: [],
            blacklist_authorities: [],
            whitelist_markets: [],
            blacklist_markets: [],
            description: description,
            extensions: []
        },
        is_prediction_market: isPredictionMarket,
        extensions: []
    };

    if (isBitAsset) {
        createAssetObject.bitasset_opts = bitassetOpts;
    }

    yield put(transaction.actions.broadcastOperation(
        {
            type: 'asset_create',
            operation: createAssetObject,
            successCallback,
            errorCallback
        }
    ));
}

export function* updateAsset({payload: {issuer, new_issuer, update, coreExchangeRate, asset, flags, permissions,
    isBitAsset, bitassetOpts, originalBitassetOpts, description}}) {

    const quotePrecision = utils.get_asset_precision(asset.get("precision"));

    big.config({DECIMAL_PLACES: asset.get("precision")});
    const maxSupply = (new big(update.max_supply)).times(quotePrecision).toString();
    const maxMarketFee = (new big(update.max_market_fee || 0)).times(quotePrecision).toString();

    const coreQuoteAsset = "" //TODO getAsset(core_exchange_rate.quote.asset_asset_name);
    const coreQuotePrecision = utils.get_asset_precision(coreQuoteAsset.get("precision"));
    const coreBaseAsset = "" //TODO getAsset(core_exchange_rate.base.asset_name);
    const coreBasePrecision = utils.get_asset_precision(coreBaseAsset.get("precision"));

    const coreQuoteAmount = (new big(coreExchangeRate.quote.amount)).times(coreQuotePrecision).toString();
    const coreBaseAmount = (new big(coreExchangeRate.base.amount)).times(coreBasePrecision).toString();

    const updateAssetObject = {
        fee:  assetConstants.ASSET_DEFAULT_FEE,
        issuer: issuer,
        asset_to_update: asset.get("asset_name"),
        new_issuer: new_issuer,
        new_options: {
            max_supply: maxSupply,
            max_market_fee: maxMarketFee,
            market_fee_percent: update.market_fee_percent * 100,
            description: description,
            issuer_permissions: permissions,
            flags: flags,
            whitelist_authorities: asset.getIn(["options", "whitelist_authorities"]),
            blacklist_authorities: asset.getIn(["options", "blacklist_authorities"]),
            whitelist_markets: asset.getIn(["options", "whitelist_markets"]),
            blacklist_markets: asset.getIn(["options", "blacklist_markets"]),
            extensions: asset.getIn(["options", "extensions"]),
            core_exchange_rate: {
                base:  coreExchangeRate.base,
                quote: coreExchangeRate.quote
            }
        },
        extensions: asset.get("extensions")
    };

    if (issuer === new_issuer || !new_issuer) {
        delete updateObject.new_issuer;
    }

    yield put(transaction.actions.broadcastOperation(
        {
            type: 'asset_update',
            operation: updateAssetObject,
            successCallback,
            errorCallback
        }
    ));

    //console.log("bitassetOpts:", bitassetOpts, "originalBitassetOpts:", originalBitassetOpts);

    if (isBitAsset && (
        bitassetOpts.feed_lifetime_sec !== originalBitassetOpts.feed_lifetime_sec ||
        bitassetOpts.minimum_feeds !== originalBitassetOpts.minimum_feeds ||
        bitassetOpts.force_settlement_delay_sec !== originalBitassetOpts.force_settlement_delay_sec ||
        bitassetOpts.force_settlement_offset_percent !== originalBitassetOpts.force_settlement_offset_percent ||
        bitassetOpts.maximum_force_settlement_volume !== originalBitassetOpts.maximum_force_settlement_volume ||
        bitassetOpts.short_backing_asset !== originalBitassetOpts.short_backing_asset)) {

        const updateBitAssetObject = {
            fee:  assetConstants.ASSET_DEFAULT_FEE,
            asset_to_update: asset.get("asset_name"),
            issuer: issuer,
            new_options: bitassetOpts,
            extensions: []
        };

        yield put(transaction.actions.broadcastOperation(
            {
                type: 'asset_update_bitasset',
                operation: updateBitAssetObject,
                successCallback,
                errorCallback
            }
        ));
    }
}

export function* issueAsset({payload: {to, from, assetName, amount, memo}}) {

    const memoObject = {
        //TODO implement
    };

    const issueAssetObject ={
        fee:  assetConstants.ASSET_DEFAULT_FEE,
        issuer: from,
        asset_to_issue: {
            amount: amount,
            asset_name: assetName
        },
        issue_to_account: to,
        memo: memoObject,
        extensions: []
    };

    yield put(transaction.actions.broadcastOperation(
        {
            type: 'asset_issue',
            operation: issueAssetObject,
            successCallback,
            errorCallback
        }
    ));
}

export function* reserveAsset({payload: {amount, assetName, payer}}) {
    const reserveAssetObject = {
        fee: assetConstants.ASSET_DEFAULT_FEE,
        payer,
        amount_to_reserve: {
            amount: amount,
            asset_name: assetName
        },
        extensions: []
    };

    yield put(transaction.actions.broadcastOperation(
        {
            type: 'asset_reserve',
            operation: reserveAssetObject,
            successCallback,
            errorCallback
        }
    ));
}

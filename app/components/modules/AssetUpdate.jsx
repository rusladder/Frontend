import React, { PropTypes } from "react";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import big from "bignumber.js";
import tt from 'counterpart';
import {Tabs, Tab} from 'app/components/elements/Tabs'
import assetUtils from "app/utils/Assets/AssetsUtils";
import utils from 'app/utils/Assets/utils';
import assetConstants from "app/utils/Assets/Constants";
import AmountSelector from 'app/components/elements/AmountSelector'
import { BitAssetOptions } from "app/components/modules/AssetCreate";
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

let MAX_SAFE_INT = new big("9007199254740991");

class AssetUpdate extends React.Component {

    constructor(props) {
        super(props);
        // this.state = this.resetState(props);
        this.state = {fetched: false}
    }

    componentDidMount() {
        this.props.dispatchGetAsset(this.props.assetname);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.asset) {
            this.setState(
                this.resetState(nextProps.asset)
            );
        }
    }

    resetState(asset_) {
        let asset = asset_.toJS();
        const isBitAsset = asset.bitasset_data !== undefined;
        const precision = utils.get_asset_precision(asset.precision);
        const max_market_fee = (new big(asset.options.max_market_fee)).div(precision).toString();
        const max_supply = (new big(asset.options.max_supply)).div(precision).toString();
        const core_exchange_rate = asset.options.core_exchange_rate;
        const flagBooleans = assetUtils.getFlagBooleans(asset.options.flags, isBitAsset);
        const permissionBooleans = assetUtils.getFlagBooleans(asset.options.issuer_permissions, isBitAsset);
        asset.options.market_fee_percent /= 100;

        return {
            fetched: true,
            update: {
                symbol: asset.asset_name,
                max_supply: max_supply,
                max_market_fee: max_market_fee,
                market_fee_percent: asset.options.market_fee_percent,
                description: assetUtils.parseDescription(asset.options.description)
            },
            errors: {
                max_supply: null
            },
            isValid: true,
            flagBooleans: flagBooleans,
            permissionBooleans: permissionBooleans,
            isBitAsset: isBitAsset,
            core_exchange_rate: core_exchange_rate,
            issuer: asset.issuer,
            new_issuer: null,
            asset_to_update: asset.id,

            bitasset_opts: isBitAsset ? asset.bitasset_data.options : null,
            original_bitasset_opts: isBitAsset ? this.props.asset.getIn(["bitasset_data", "options"]).toJS() : null,
            marketInput: ""
        };
    }

    updateAsset(e) {
        e.preventDefault();
        const {update, issuer, new_issuer_account, core_exchange_rate, flagBooleans,
            permissionBooleans, isBitAsset, bitasset_opts, original_bitasset_opts} = this.state;

        const flags = assetUtils.getFlags(flagBooleans);

        const permissions = assetUtils.getPermissions(permissionBooleans, isBitAsset);

        if (this.state.marketInput !== update.description.market) {
            update.description.market = "";
        }
        const description = JSON.stringify(update.description);

        this.props.updateAsset(issuer, new_issuer_account, update, core_exchange_rate, this.props.asset,
            flags, permissions, isBitAsset, bitasset_opts, original_bitasset_opts, description);
    }

    reset(e) {
        e.preventDefault();

        this.setState(
            this.resetState(this.props.asset)
        );
    }

    forcePositive(number) {
        return parseFloat(number) < 0 ? "0" : number;
    }

    onUpdateDescription(value, e) {
        const {update} = this.state;
        let updateState = true;

        switch (value) {
            case "condition":
                if (e.target.value.length > 60) {
                    updateState = false;
                    return;
                }
                update.description[value] = e.target.value;
                break;

            case "short_name":
                if (e.target.value.length > 32) {
                    updateState = false;
                    return;
                }
                update.description[value] = e.target.value;
                break;

            case "market":
                update.description[value] = e;
                break;

            default:
                update.description[value] = e.target.value;
                break;
        }

        if (updateState) {
            this.validateEditFields(update);
        }
    }

    onChangeBitAssetOpts(value, e) {
        const {bitasset_opts} = this.state;

        switch (value) {
            case "force_settlement_offset_percent":
            case "maximum_force_settlement_volume":
                bitasset_opts[value] = parseFloat(e.target.value) * assetConstants.STEEMIT_1_PERCENT;
                break;

            case "feed_lifetime_sec":
            case "force_settlement_delay_sec":
                console.log(e.target.value, parseInt(parseFloat(e.target.value) * 60, 10));
                bitasset_opts[value] = parseInt(parseFloat(e.target.value) * 60, 10);
                break;

            case "short_backing_asset":
                bitasset_opts[value] = e;
                break;

            default:
                bitasset_opts[value] = parseInt(e.target.value, 10);
                break;
        }
    }

    validateEditFields( new_state ) {
        const cer = new_state.core_exchange_rate;
        const {asset, core} = this.props;

        let errors = {
            max_supply: null,
            quote_asset: null,
            base_asset: null
        };

        errors.max_supply = new_state.max_supply <= 0 ? tt("account.user_issued_assets.max_positive") : null;
        //TODO
        if (cer) {
            if (cer.quote.asset_id !== asset.get("id") && cer.base.asset_id !== asset.get("id")) {
                errors.quote_asset = tt("account.user_issued_assets.need_asset", {name: asset.get("asset_name")});
            }

            if (cer.quote.asset_id !== core.get("id") && cer.base.asset_id !== core.get("id")) {
                errors.base_asset = tt("account.user_issued_assets.need_asset", {name: core.get("asset_name")});
            }
        }
        const isValid = !errors.max_supply && !errors.base_asset && !errors.quote_asset;

        this.setState({isValid: isValid, errors: errors});
    }

    onUpdateInput(value, e) {
        const {update} = this.state;
        let updateState = true;
        const precision = utils.get_asset_precision(this.props.asset.get("precision"));

        switch (value) {
            case "market_fee_percent":
                update[value] = this.forcePositive(e.target.value);
                break;

            case "max_market_fee":
                let marketFee = e.target.value;
                if ((new big(marketFee)).times(precision).gt(MAX_SAFE_INT)) {
                    updateState = false;
                    return this.setState({errors: {max_market_fee: "The number you tried to enter is too large"}});
                }
                update[value] = utils.limitByPrecision(marketFee, this.props.asset.get("precision"));
                break;

            case "max_supply":
                let maxSupply = e.target.value;
                try {
                    if ((new big(maxSupply)).times(precision).gt(MAX_SAFE_INT)) {
                        updateState = false;
                        return this.setState({errors: {max_supply: "The number you tried to enter is too large"}});
                    }
                    update[value] = utils.limitByPrecision(maxSupply, this.props.asset.get("precision"));
                } catch(e) {}
                break;

            default:
                update[value] = e.target.value;
                break;
        }

        if (updateState) {
            this.setState({update: update});
            this.validateEditFields(update);
        }
    }

    onCoreRateChange(type, e) {
        let amount, asset;
        if (type === "quote") {
            amount = utils.limitByPrecision(e.target.value, this.state.update.precision);
            asset = this.props.asset.get("asset_name");
        } else {
            if (!e || !("amount" in e)) {
                return;
            }
            const precision = utils.get_asset_precision(this.props.core);
            amount = e.amount == "" ? "0" : utils.limitByPrecision(e.amount, precision);
            asset = 'GOLOS';
        }

        const {core_exchange_rate} = this.state;
        core_exchange_rate[type] = [amount, asset].join(' ');
        this.setState(core_exchange_rate);
    }

    issuerNameChanged(event) {
        const name = event.target.value.trim()
        this.setState({new_issuer: name});
    }

    onInputMarket(event) {
        const asset = event.target.value.trim().substr(0, 6).toUpperCase();
        this.setState({marketInput: asset});

        this.onUpdateDescription("market", asset);
    }

    onFoundMarketAsset(asset) {
        if (asset) {
            this.onUpdateDescription("market", asset.get("asset_name"));
        }
    }

    onFlagChange(key) {
        let booleans = this.state.flagBooleans;
        booleans[key] = !booleans[key];
        this.setState({flagBooleans: booleans});
    }

    onPermissionChange(key) {
        const booleans = this.state.permissionBooleans;
        booleans[key] = !booleans[key];
        this.setState({permissionBooleans: booleans});
    }

    render() {
        if (!this.state.fetched){
            return <center><LoadingIndicator type="circle" /></center>;
        }
        const { account, asset, core } = this.props;
        const { errors, isValid, update, assets, core_exchange_rate, flagBooleans,
            permissionBooleans, isBitAsset, bitasset_opts } = this.state;

        const assetName = asset.get("asset_name");
        const precision = asset.get("precision");
        const originalPermissions = assetUtils.getFlagBooleans(asset.getIn(["options", "issuer_permissions"]), asset.get("bitasset") !== undefined);

        // Loop over flags
        let flags = [];
        for (let key in permissionBooleans) {
            if (permissionBooleans[key] && key !== "charge_market_fee") {
                flags.push(
                    <table key={"table_" + key} className="table">
                        <tbody>
                        <tr>
                            <td style={{border: "none", width: "80%"}}>{tt(`user_issued_assets.${key}`)}:</td>
                            <td style={{border: "none"}}>
                                <div className="switch"  onClick={this.onFlagChange.bind(this, key)}>
                                    <input type="checkbox" checked={flagBooleans[key]} />
                                    <label />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                )
            }
        }

        // Loop over permissions
        let permissions = [];
        for (let key in permissionBooleans) {
            permissions.push(
                <table key={"table_" + key} className="table">
                    <tbody>
                    <tr>
                        <td style={{border: "none", width: "80%"}}>{tt(`user_issued_assets.${key}`)}:</td>
                        <td style={{border: "none"}}>
                            <div className="switch" onClick={this.onPermissionChange.bind(this, key)}>
                                <input type="checkbox" checked={permissionBooleans[key]} onChange={() => {}}/>
                                <label />
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            )
        }

        const isPredictionMarketAsset = asset.getIn(["bitasset", "is_prediction_market"]);

        const quoteAmount = assetUtils.splitAmount(core_exchange_rate.quote);
        const baseAmount = assetUtils.splitAmount(core_exchange_rate.base);
        // const price = utils.get_asset_price(
        //     quoteAmount[0] * precision,
        //     {precision: precision},
        //     baseAmount[0] * 3,
        //     core);
        //
        // const formattedPrice = price.toFixed((parseInt(precision, 10) || 8));

        const tabs = <div className="AssetCreate_tabs">
            <h4>{tt('asset_update_jsx.header')}: {assetName}</h4>
            <Tabs>
                <Tab title={tt('user_issued_assets.primary')}>
                    <div className="row">
                        <div className="column small-12">
                            <h5>{tt('user_issued_assets.primary')}</h5>
                            <label>{tt('user_issued_assets.precision')}
                                <span>: {precision}</span>
                            </label>

                            <label>{tt('user_issued_assets.max_supply')}
                                <input
                                    type="number"
                                    value={update.max_supply}
                                    onChange={this.onUpdateInput.bind(this, "max_supply")}
                                />
                            </label>
                            { errors.max_supply ? <p className="error">{errors.max_supply}</p> : null}

                            <h5>{tt('user_issued_assets.core_exchange_rate')}</h5>

                            <div className="row margin">
                                {errors.quote_asset ? <p className="error">{errors.quote_asset}</p> : null}
                                {errors.base_asset ? <p className="error">{errors.base_asset}</p> : null}
                                <div className="column small-12 medium-6">
                                    <div className="amount-selector" style={{width: "100%", paddingRight: "10px"}}>
                                        {tt('user_issued_assets.quote')}
                                        <div className="inline-label">
                                            <input
                                                type="text"
                                                placeholder="0.001"
                                                onChange={this.onCoreRateChange.bind(this, "quote")}
                                                value={assetUtils.splitAmount(core_exchange_rate.quote)[0]}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="column small-12 medium-6">
                                    <AmountSelector
                                        label={tt('user_issued_assets.base')}
                                        amount={assetUtils.splitAmount(core_exchange_rate.base)[0]}
                                        onChange={this.onCoreRateChange.bind(this, "base")}
                                        asset={assetUtils.splitAmount(core_exchange_rate.base)[1]}
                                        placeholder="0.001"
                                        tabIndex={1}
                                    />
                                </div>
                            </div>
                            <div>
                                <h5>
                                    {tt('asset_create_jsx.price')}
                                    <span>: {/*formattedPrice*/}</span>
                                    <span> {asset.get("asset_name")} / {core.get("asset_name")}</span>
                                </h5>
                            </div>

                        </div>
                    </div>
                </Tab>

                <Tab title={tt('user_issued_assets.description')}>
                    <div className="row margin">
                        <div className="column small-12">
                            <label>
                                {tt('user_issued_assets.description')}
                                <textarea
                                    style={{height: "7rem"}}
                                    rows="1"
                                    value={update.description.main}
                                    onChange={this.onUpdateDescription.bind(this, "main")}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="row margin">
                        <div className="column small-12">
                            <label>
                                {tt('user_issued_assets.short')}
                                <input
                                    type="text"
                                    rows="1"
                                    value={update.description.short_name  || ""}
                                    onChange={this.onUpdateDescription.bind(this, "short_name")}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="row margin">
                        <div className="column small-12">
                            <h5>{tt('user_issued_assets.market')}</h5>
                            <input /*AssetSelector*/
                                type="text"
                                value={this.state.marketInput || ""}
                                placeholder={tt('asset_create_jsx.symbol')}
                                onChange={this.onInputMarket.bind(this)}
                            />
                            {isPredictionMarketAsset
                                ? (<div>
                                    <label>
                                        {tt('user_issued_assets.condition')}
                                        <input
                                            type="text"
                                            rows="1"
                                            value={update.description.condition}
                                            onChange={this.onUpdateDescription.bind(this, "condition")}
                                        />
                                    </label>

                                    <label>
                                        {tt('user_issued_assets.expiry')}
                                        <input
                                            type="date"
                                            value={update.description.expiry}
                                            onChange={this.onUpdateDescription.bind(this, "expiry")}
                                        />
                                    </label>
                                </div>)
                                : null
                            }
                        </div>
                    </div>
                </Tab>

                <Tab title={tt('user_issued_assets.update_owner')}>
                    <div className="row margin">
                        <div className="column small-12">
                            {tt('user_issued_assets.current_issuer')}
                            <input
                                type="text"
                                rows="1"
                                value={this.state.issuer}
                            />

                            <br />
                            {tt('user_issued_assets.new_issuer')}
                            <input
                                type="text"
                                rows="1"
                                value={this.state.new_issuer}
                                onChange={this.issuerNameChanged.bind(this)}
                            />

                        </div>
                    </div>
                </Tab>

                <Tab title={tt('asset_update_jsx.permissions')}>
                    <div className="row margin">
                        <div className="column small-12">
                            <div className="txt-label error">{tt('user_issued_assets.perm_warning')}</div>
                            {permissions}
                        </div>
                    </div>
                </Tab>

                <Tab title={tt('user_issued_assets.flags')}>
                    <div className="row margin">
                        <div className="column small-12">
                            <div className="row margin">
                                <div className="column small-12">
                                    {tt('asset_create_jsx.help.marker')}
                                </div>
                            </div>
                            {originalPermissions["charge_market_fee"]
                                ? (<div className="row margin">
                                    <div className="column small-12">
                                        {tt('user_issued_assets.market_fee')}
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td style={{border: "none", width: "80%"}}>{tt('user_issued_assets.market_fee')}:</td>
                                                <td style={{border: "none"}}>
                                                    <div className="switch" onClick={this.onFlagChange.bind(this, "charge_market_fee")}>
                                                        <input type="checkbox" checked={flagBooleans.charge_market_fee} />
                                                        <label />
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <div className="row margin">
                                            <div className="column small-6">
                                                <label>{tt('user_issued_assets.market_fee')} (%)
                                                    <input
                                                        disabled={!flagBooleans.charge_market_fee}
                                                        type="number"
                                                        value={update.market_fee_percent}
                                                        onChange={this.onUpdateInput.bind(this, "market_fee_percent")}/>
                                                </label>
                                            </div>
                                            <div className="column small-6">
                                                <label>{tt('user_issued_assets.max_market_fee')} ({update.symbol})
                                                    <input
                                                        disabled={!flagBooleans.charge_market_fee}
                                                        type="number"
                                                        value={update.max_market_fee}
                                                        onChange={this.onUpdateInput.bind(this, "max_market_fee")}/>
                                                </label>
                                            </div>
                                            { errors.max_market_fee ? <p className="error">{errors.max_market_fee}</p> : null}
                                        </div>
                                    </div>
                                </div>)
                                : null
                            }

                            <h5>{tt('user_issued_assets.flags')}</h5>
                            {flags}

                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>

        return (
            <div className="row">
                <div className="column large-8 small-12">
                    {tabs}
                    <hr/>
                    <div style={{paddingTop: "0.5rem"}}>
                        <button className={"button "} onClick={this.updateAsset.bind(this)}>
                            {tt('asset_update_jsx.update_asset')}
                        </button>
                        <button className="button hollow" onClick={this.reset.bind(this)}>
                            {tt('asset_update_jsx.reset')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(

    (state, props) => {
        const asset = state.assets.get('received');
        const core = state.assets.get('core');

        return {...props, asset, core};
    },

    dispatch => ({

        dispatchGetAsset : (assetName) => {

            dispatch({type: 'GET_ASSET', payload: {assetName}})
        },

        updateAsset : (issuer, new_issuer, update, coreExchangeRate, asset,
        flags, permissions, isBitAsset, bitassetOpts, originalBitassetOpts, description) => {

            const successCallback = () => {
                browserHistory.push(`/@${issuer}/assets`);
            };

            const errorCallback = () => {
                console.log('errorCallback')
            };

            dispatch({
                type: 'UPDATE_ASSET',
                payload: {
                    issuer,
                    new_issuer,
                    update,
                    coreExchangeRate,
                    asset,
                    flags,
                    permissions,
                    isBitAsset,
                    bitassetOpts,
                    originalBitassetOpts,
                    description,
                    successCallback,
                    errorCallback
                }
            });
        }
    })
)(AssetUpdate)



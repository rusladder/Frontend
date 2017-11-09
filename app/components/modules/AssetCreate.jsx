import React, { PropTypes } from "react";
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import big from "bignumber.js";
import tt from 'counterpart';
import {Tabs, Tab} from 'app/components/elements/Tabs'
import AmountSelector from 'app/components/elements/AmountSelector'
import assetConstants from "app/utils/Assets/Constants";
import assetUtils from "app/utils/Assets/AssetsUtils";
import utils from 'app/utils/Assets/utils';
import {validate_asset_symbol} from 'app/utils/ChainValidation';
import { formatAmount } from 'app/utils/ParsersAndFormatters'
import {api} from 'golos-js'

let MAX_SAFE_INT = new big("9007199254740991");

export class BitAssetOptions extends React.Component {

    static propTypes = {
        backingAsset: PropTypes.string.isRequired,
        isUpdate: PropTypes.bool
    };

    static defaultProps = {
        isUpdate: false
    };

    constructor(props) {
        super(props);
        this.state = {
            backingAsset: this.props.backingAsset,
            error: null
        };
    }

    onInputBackingAsset(event) {
        const asset = event.target.value;
        this.setState({
            backingAsset: asset.toUpperCase(),
            error: null
        });
    }

    onFoundBackingAsset(asset) {
        if (asset) {
            if (asset.get('asset_name') === 'GOLOS' || (asset.get('bitasset_data') && !asset.getIn(['bitasset', 'is_prediction_market']))) {
                if (asset.get("precision") !== parseInt(this.props.assetPrecision, 10)) {
                    this.setState({error: tt('account.user_issued_assets.error_precision', {asset: this.props.assetName})});
                } else {
                    this.props.onUpdate("short_backing_asset", asset.get("asset_name"));
                }
            } else {
                this.setState({ error: tt('account.user_issued_assets.error_invalid')});
            }
        }
    }

    render() {
        let { bitasset_opts } = this.props;
        let { error } = this.state;

        return (
            <div className="column small-12">
                <div className="row margin">
                    <div className="column small-12">
                        <label>{tt('user_issued_assets.feed_lifetime_sec')}
                            <input
                                type="number"
                                value={bitasset_opts.feed_lifetime_sec / 60}
                                onChange={this.props.onUpdate.bind(this, "feed_lifetime_sec")}/>
                        </label>
                    </div>
                </div>

                 <div className="row margin">
                    <div className="column small-12">
                        <label>{tt('user_issued_assets.minimum_feeds')}
                            <input
                                type="number"
                                value={bitasset_opts.minimum_feeds}
                                onChange={this.props.onUpdate.bind(this, "minimum_feeds")}/>
                        </label>
                    </div>
                </div>

                <div className="row margin">
                    <div className="column small-12">
                        <label>{tt('user_issued_assets.force_settlement_delay_sec')}
                            <input type="number"
                                   value={bitasset_opts.force_settlement_delay_sec / 60}
                                   onChange={this.props.onUpdate.bind(this, "force_settlement_delay_sec")}/>
                        </label>
                    </div>
                </div>

                <div className="row margin">
                    <div className="column small-12">
                        <label>{tt('user_issued_assets.force_settlement_offset_percent')}
                            <input type="number"
                                   value={bitasset_opts.force_settlement_offset_percent / assetConstants.STEEMIT_1_PERCENT}
                                   onChange={this.props.onUpdate.bind(this, "force_settlement_offset_percent")}/>
                        </label>
                    </div>
                </div>

                <div className="row margin">
                    <div className="column small-12">
                        <label>{tt('user_issued_assets.maximum_force_settlement_volume')}
                            <input type="number"
                                   value={bitasset_opts.maximum_force_settlement_volume / assetConstants.STEEMIT_1_PERCENT}
                                   onChange={this.props.onUpdate.bind(this, "maximum_force_settlement_volume")}/>
                        </label>
                    </div>
                </div>

                <div className="row margin">
                    <div className="column small-12">
                        <label>
                            {tt('user_issued_assets.backing')}
                            <input /* FIXME AssetSelector*/
                                type="text"
                                value={this.state.backingAsset || ""}
                                placeholder={tt('user_issued_assets.backing')}
                                onChange={this.onInputBackingAsset.bind(this)}
                            />
                        </label>
                        {error ? <div className="error">{error}</div> : null}
                    </div>
                </div>
            </div>
        );
    }
}

class AssetCreate extends React.Component {

    static propTypes = {
        core: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);
        this.state = this.resetState();
    }

    resetState() {
        let isBitAsset = false;
        let {flagBooleans, permissionBooleans} = this.getPermissions({isBitAsset});

        return {

            update: {
                symbol: '',
                precision: 4,
                max_supply: 100000,
                max_market_fee: 0,
                market_fee_percent: 0,
                description: {main: ''}
            },
            errors: {
                max_supply: null
            },
            nameCost: null,
            isValid: true,
            flagBooleans: flagBooleans,
            permissionBooleans: permissionBooleans,
            isBitAsset: isBitAsset,
            is_prediction_market: false,
            core_exchange_rate: {
                quote: '1 -',
                base: '1 GOLOS'
            },
            bitasset_opts: {
                feed_lifetime_sec : assetConstants.STEEMIT_DEFAULT_PRICE_FEED_LIFETIME,
                minimum_feeds : 1,
                force_settlement_delay_sec : assetConstants.STEEMIT_DEFAULT_FORCE_SETTLEMENT_DELAY,
                force_settlement_offset_percent : assetConstants.STEEMIT_DEFAULT_FORCE_SETTLEMENT_OFFSET,
                maximum_force_settlement_volume : assetConstants.STEEMIT_DEFAULT_FORCE_SETTLEMENT_MAX_VOLUME,
                short_backing_asset : 'GOLOS'
            },
            marketInput: ''
        };
    }

    getPermissions(state) {
        const flagBooleans = assetUtils.getFlagBooleans(0, state.isBitAsset);
        const permissionBooleans = assetUtils.getFlagBooleans("all", state.isBitAsset);

        return {
            flagBooleans,
            permissionBooleans
        }
    }

    forcePositive(number) {
        return parseFloat(number) < 0 ? "0" : number;
    }

    onInputMarket(event) {
        const asset = event.target.value.trim().substr(0, 6).toUpperCase();
        this.setState({marketInput: asset});

        this.onUpdateDescription("market", asset);
    }

    onChangeBitAssetOpts(value, e) {
        let {bitasset_opts} = this.state;

        switch (value) {
            case "force_settlement_offset_percent":
            case "maximum_force_settlement_volume":
                bitasset_opts[value] = parseFloat(e.target.value) * assetConstants.STEEMIT_1_PERCENT;
                break;

            case "feed_lifetime_sec":
            case "force_settlement_delay_sec":
                bitasset_opts[value] = parseInt(parseFloat(e.target.value) * 60, 10);
                break;

            case "short_backing_asset":
                bitasset_opts[value] = e;
                break;

            default:
                bitasset_opts[value] = parseInt(e.target.value, 10);
                break;
        }
        this.setState({bitasset_opts});
    }

    onUpdateInput(value, e) {
        let {update} = this.state;
        let updateState = true;
        let precision = utils.get_asset_precision(this.state.update.precision);
        switch (value) {
            case "market_fee_percent":
                update[value] = this.forcePositive(e.target.value);
                break;

            case "max_market_fee":
                if ((new big(e.target.value)).times(precision).gt(MAX_SAFE_INT)) {
                    updateState = false;
                    return this.setState({errors: {max_market_fee: "The number you tried to enter is too large"}});
                }
                e.target.value = utils.limitByPrecision(e.target.value, this.state.update.precision);
                update[value] = e.target.value;
                break;

            case "precision":
                // Enforce positive number
                update[value] = this.forcePositive(e.target.value);
                break;

            case "max_supply":
                if ((new big(e.target.value)).times(precision).gt(MAX_SAFE_INT)) {
                    updateState = false;
                    return this.setState({errors: {max_supply: "The number you tried to enter is too large"}});
                }
                e.target.value = utils.limitByPrecision(e.target.value, this.state.update.precision);
                update[value] = e.target.value;
                break;

            case "symbol":
                // Enforce uppercase
                e.target.value = e.target.value.toUpperCase();
                // Enforce characters
                let regexp = new RegExp("^[\.A-Z]+$");
                if (e.target.value !== "" && !regexp.test(e.target.value)) {
                    break;
                }

                this.validateAssetName(e.target.value);

                const {core_exchange_rate} = this.state;
                core_exchange_rate.quote = [core_exchange_rate.quote.split(' ')[0], e.target.value].join(' ');
                this.setState(core_exchange_rate);

                update[value] = this.forcePositive(e.target.value);
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

    validateAssetName(assetName) {
        const balance = this.props.account.balance.split(' ')[0];
        let error = '';
        let promise;
        if (assetName.length > 0) {
            error = validate_asset_symbol(assetName);
            if (!error) {
                promise = api.getAssetsAsync([assetName]).then(res => {
                    return (res && res.length > 0 && res[0] != null) ? tt('user_issued_assets.exists') : '';
                });

                api.getNameCostAsync(assetName).then(res => {
                    let cost = res.split(' ')[0]
                    if (cost !== '0.000') {
                        this.setState({ nameCost: res })
                        if (parseInt(cost.split('.')[0]) > parseInt(balance.split('.')[0])) {
                            this.setState({ isValid: false, errors: { symbol: tt('asset_create_jsx.insufficent_funds')} })
                        }
                    } else {
                        this.setState({ nameCost: null })
                    }
                });
            }
        }
        if (promise) {
            promise
                .then(error => this.setState({errors: {symbol : error}}))
                .catch(() => this.setState({errors: {symbol : "Asset name can't be verified right now due to server failure. Please try again later."}}));
        } else {
            this.setState({errors: {symbol : error}});
        }
    }

    onUpdateDescription(value, e) {
        let {update} = this.state;
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

    onCoreRateChange(type, e) {
        let amount, asset;
        if (type === "quote") {
            amount = e.amount == "" ? "0" :utils.limitByPrecision(e.amount, this.state.update.precision);
            asset = this.state.update.symbol;
        } else {
            amount = e.amount == "" ? "0" : utils.limitByPrecision(e.amount, this.props.core.get('precision'));
            asset = 'GOLOS';
        }

        const {core_exchange_rate} = this.state;
        core_exchange_rate[type] = [amount, asset].join(' ');
        this.setState(core_exchange_rate);
    }

    onToggleBitAsset() {
        this.state.isBitAsset = !this.state.isBitAsset;
        if (!this.state.isBitAsset) {
            this.setState({is_prediction_market :false})
        }

        const {flagBooleans, permissionBooleans} = this.getPermissions(this.state);
        this.setState({flagBooleans});
        this.setState({permissionBooleans});
    }

    validateEditFields( new_state ) {
        const errors = {
            max_supply: null
        };

        errors.symbol = validate_asset_symbol(new_state.symbol);
        errors.max_supply = new_state.max_supply <= 0 ? tt('user_issued_assets.max_positive') : null;

        const isValid = !errors.symbol && !errors.max_supply;
        this.setState({isValid: isValid, errors: errors});
    }

    onFlagChange(key) {
        const booleans = this.state.flagBooleans;
        booleans[key] = !booleans[key];
        this.setState({ flagBooleans: booleans });
    }

    onPermissionChange(key) {
        const booleans = this.state.permissionBooleans;
        booleans[key] = !booleans[key];
        this.setState({ permissionBooleans: booleans });
    }

    onTogglePM() {
        this.setState({is_prediction_market : !this.state.is_prediction_market});

        const { update } = this.state;
        update.precision = this.props.core.get("precision");
        this.setState({update});
    }

    createAsset(e) {
        e.preventDefault();
        const { update, flagBooleans, permissionBooleans, core_exchange_rate,
            isBitAsset, is_prediction_market, bitasset_opts } = this.state;

        this.validateEditFields(update);

        const { account } = this.props;

        const flags = assetUtils.getFlags(flagBooleans, isBitAsset);
        const permissions = assetUtils.getPermissions(permissionBooleans, isBitAsset);

        if (this.state.marketInput !== update.description.market) {
            update.description.market = "";
        }
        const description = JSON.stringify(update.description);

        this.props.assetCreate(account.name, update, flags, permissions, core_exchange_rate, isBitAsset,
            is_prediction_market, bitasset_opts, description);
    }

    reset(e) {
        e.preventDefault();
        this.setState(
            this.resetState(this.props)
        );
    }

    render() {
        const { core } = this.props;
        const { errors, isValid, update, flagBooleans, permissionBooleans,
            core_exchange_rate, is_prediction_market, isBitAsset, bitasset_opts, nameCost } = this.state;

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

        const quoteAmount = assetUtils.splitAmount(core_exchange_rate.quote);
        const baseAmount = assetUtils.splitAmount(core_exchange_rate.base);
        const price = utils.get_asset_price(
            quoteAmount[0] * utils.get_asset_precision(update.precision),
            {precision: update.precision},
            baseAmount[0] * utils.get_asset_precision(core),
            core);
        const formattedPrice = price.toFixed(2 + (parseInt(update.precision, 10) || 8));

        let tabs = <div className="AssetCreate_tabs">
            <h4>{tt('asset_create_jsx.header')}</h4>
            <Tabs>
                <Tab title={tt('user_issued_assets.primary')}>
                    <div className="row">
                        <div className="column small-12">
                            <h5>{tt('user_issued_assets.primary')}</h5>
                            <div className="row margin">
                                <div className="column small-6">
                                    <label>{tt('user_issued_assets.symbol')}
                                        <input
                                            type="text"
                                            value={update.symbol}
                                            onChange={this.onUpdateInput.bind(this, "symbol")}
                                        />
                                    </label>
                                    { nameCost && <p className="warning">{ tt('asset_create_jsx.ticker_name_cost') }: { nameCost } </p> }
                                    { errors.symbol ? <p className="error">{ errors.symbol }</p> : null }
                                </div>

                                <div className="column small-6">
                                    <label>{tt('user_issued_assets.max_supply')}
                                        <input
                                            type="number"
                                            value={update.max_supply}
                                            onChange={this.onUpdateInput.bind(this, "max_supply")}
                                        />
                                    </label>
                                    { errors.max_supply ? <p className="error">{errors.max_supply}</p> : null}
                                </div>
                            </div>
                            <div className="row margin">
                                <div className="column small-6">
                                    <label>{tt('user_issued_assets.decimals')}</label>
                                </div>
                                <div className="column small-6">
                                    <span style={{marginRight: "1.5rem"}}>{update.precision}</span>
                                    <input
                                        min="0"
                                        max="8"
                                        step="1"
                                        type="range"
                                        value={update.precision}
                                        onChange={this.onUpdateInput.bind(this, "precision")}
                                    />
                                </div>
                            </div>

                            <div className="txt-label warning">{tt('user_issued_assets.precision_warning')}</div>

                            <div className="row margin">
                                <div className="column small-6 medium-3">
                                    <div className="switch" onClick={this.onToggleBitAsset.bind(this)}>
                                        <label>{tt('user_issued_assets.mpa')}:
                                            <input
                                                type="checkbox"
                                                checked={isBitAsset}
                                            />
                                        </label>
                                    </div>
                                </div>

                                 <div className="column small-6 medium-6">
                                    {isBitAsset
                                        ? (<div className="switch" onClick={this.onTogglePM.bind(this)}>
                                                <label>{tt('user_issued_assets.pm')}:
                                                    <input
                                                        type="checkbox"
                                                        checked={is_prediction_market}
                                                    />
                                                </label>
                                            </div>)
                                        : null
                                    }
                                </div>
                            </div>

                            <h5>{tt('user_issued_assets.core_exchange_rate')}</h5>

                            <label>
                                <div className="row margin">
                                    {errors.quote_asset ? <p className="error">{errors.quote_asset}</p> : null}
                                    {errors.base_asset ? <p className="error">{errors.base_asset}</p> : null}
                                    <div className="column small-12 medium-6">
                                        <AmountSelector
                                            label={tt('user_issued_assets.quote')}
                                            amount={formatAmount(core_exchange_rate.quote.split(' ')[0])}
                                            onChange={this.onCoreRateChange.bind(this, "quote")}
                                            asset={assetUtils.splitAmount(core_exchange_rate.quote)[1]}
                                            placeholder="0.001"
                                        />

                                    </div>
                                    <div className="column small-12 medium-6">
                                         <AmountSelector
                                            label={tt('user_issued_assets.base')}
                                            amount={formatAmount(core_exchange_rate.base.split(' ')[0])}
                                            onChange={this.onCoreRateChange.bind(this, "base")}
                                            asset={assetUtils.splitAmount(core_exchange_rate.base)[1]}
                                            placeholder="0.001"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h5>
                                        {tt('asset_create_jsx.price')}
                                        <span>: {formattedPrice}</span>
                                        <span> {update.symbol} / {core.get("asset_name")}</span>
                                    </h5>
                                </div>
                            </label>
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
                                    value={update.description.short_name}
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
                            {is_prediction_market
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

                {isBitAsset
                    ? (<Tab title={tt('user_issued_assets.bitasset_opts')}>
                            <BitAssetOptions
                                bitasset_opts={bitasset_opts}
                                onUpdate={this.onChangeBitAssetOpts.bind(this)}
                                backingAsset={bitasset_opts.short_backing_asset}
                                assetPrecision={update.precision}
                                assetSymbol={update.symbol}
                            />
                        </Tab>)
                    : null
                }

                <Tab title={tt('asset_create_jsx.permissions')}>
                    <div className="row margin">
                        <div className="column small-12">
                            <div className="help-content">{tt('asset_create_jsx.help.permissions_first')}</div>
                            <div className="help-content">{tt('asset_create_jsx.help.permissions_second')}</div>
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
                            {permissionBooleans["charge_market_fee"]
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
                        <button className={"button"} disabled={!isValid} onClick={this.createAsset.bind(this)}>
                            {tt('asset_create_jsx.create_asset')}
                        </button>
                        <button className="button hollow" onClick={this.reset.bind(this)}>
                            {tt('asset_create_jsx.reset')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const core = state.assets.get('core');

        return {...props, core};
    },
    dispatch => ({

        assetCreate : (account, createObject, flags, permissions, coreExchangeRate,
                       isBitAsset, isPredictionMarket, bitassetOpts, description) => {

            const successCallback = () => {
                browserHistory.push(`/@${account}/assets`);

                dispatch({type: 'ADD_NOTIFICATION', payload:
                    {
                        key: "asset_create_" + Date.now(),
                        message: tt('asset_create_jsx.notification', { asset: createObject.symbol }),
                        dismissAfter: 5000
                    }
                })
            };

            const errorCallback = () => {
                console.log('errorCallback')
            };

            dispatch({
                type: 'CREATE_ASSET',
                payload: {
                    account,
                    createObject,
                    flags,
                    permissions,
                    coreExchangeRate,
                    isBitAsset,
                    isPredictionMarket,
                    bitassetOpts,
                    description,
                    confirmTitle: {title: tt('asset_create_jsx.confirm_title')},
                    confirmText: tt('asset_create_jsx.confirm_create_asset', { asset: createObject.symbol }),
                    successCallback,
                    errorCallback
                }
            });
        }
    })
)(AssetCreate);

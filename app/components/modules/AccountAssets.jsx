import React, { PropTypes } from "react";
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import FormattedAsset from "app/components/elements/FormattedAsset";
import assetUtils from "app/utils/Assets/AssetsUtils";

class AccountAssets extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    checkAssets(assets, force) {
        let lastAsset = assets.sort((a, b) => {
            if (a.symbol > b.symbol) {
                return 1;
            } else if (a.symbol < b.symbol) {
                return -1;
            } else {
                return 0;
            }
        }).last();

        if (assets.size === 0 || force) {
            //TODO
            // getAssetList.defer("A", 100);
            this.setState({assetsFetched: 100});
        } else if (assets.size >= this.state.assetsFetched) {
            //TODO
            // getAssetList.defer(lastAsset.symbol, 100);
            this.setState({assetsFetched: this.state.assetsFetched + 99});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.checkAssets(nextProps.assets);
    }

    componentWillMount() {
        this.checkAssets(this.props.assets, true);
    }

    reserveButtonClick(asset_name, e) {
        e.preventDefault();
        this.setState({reserve: asset_name});
        //TODO implement
    }

    issueButtonClick(asset_name, e) {
        e.preventDefault();
        const {issue} = this.state;
        issue.asset_name = asset_name;
        this.setState({issue: issue});
        //TODO implement
    }

    editButtonClick(assetName, accountName, e) {
        e.preventDefault();
        browserHistory.push(`/@${accountName}/update-asset/${assetName}`);
    }

    render() {
        const {account, account_name, assets} = this.props;

        const myAssets = assets
        //TODO need for debug
        // .filter(asset => {
        //     return asset.issuer === account.id; //account_name
        // })
        .map(asset => {
            const description = assetUtils.parseDescription(asset.common_options.description);
            let desc = description.short_name ? description.short_name : description.main;

            if (desc.length > 100) {
                desc = desc.substr(0, 100) + "...";
            }
            return (
                <tr key={asset.asset_name}>
                    <td><Link to={`/asset/${asset.asset_name}`}>{asset.asset_name}</Link></td>
                    <td style={{maxWidth: "250px"}}>{desc}</td>
                    <td>{<FormattedAsset amount={parseInt(asset.dynamic_data.current_supply, 10)} asset={asset} />}</td>
                    <td>{<FormattedAsset amount={parseInt(asset.common_options.max_supply, 10)} asset={asset} />}</td>
                    <td>
                        {!asset.bitasset_opts
                            ? (<button onClick={this.issueButtonClick.bind(this, asset.asset_name)} className="tiny button slim">
                                    {tt('account_assets_jsx.asset_issue')}
                               </button>)
                            : null
                        }
                    </td>
                    <td>
                        {!asset.bitasset_opts
                            ? (<button onClick={this.reserveButtonClick.bind(this, asset.asset_name)} className="tiny button slim">
                                    {tt('account_assets_jsx.asset_reserve')}
                                </button>)
                            : null
                        }
                    </td>
                    <td>
                        <button onClick={this.editButtonClick.bind(this, asset.asset_name, account_name)} className="tiny button slim">
                            {tt('account_assets_jsx.asset_update')}
                        </button>
                    </td>
                </tr>
            );
        }).toArray();

        return (
            <div className="row">
                <div className="column small-12">
                    <div className="row">
                        <div className="columns small-6 medium-12 medium-expand">
                            <h4>{tt('user_issued_assets.issued_assets')}</h4>
                        </div>
                        <div className="columns shrink right-column">
                            <Link to={`/@${account_name}/create-asset/`} className="button">
                                {tt('account_assets_jsx.asset_create')}
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column small-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{tt('user_issued_assets.symbol')}</th>
                                        <th style={{maxWidth: "250px"}}>{tt('user_issued_assets.description')}</th>
                                        <th>{tt('account_assets_jsx.supply')}</th>
                                        <th style={{maxWidth: "140px"}}>{tt('user_issued_assets.max_supply')}</th>
                                        <th style={{textAlign: "center"}} colSpan="3">{tt('account_assets_jsx.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myAssets}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default connect(
    state => {
        return {
            assets: state.assets.get('assets')
        }
    },
    dispatch => ({
        //TODO dispatch reactForm
    })
)(AccountAssets)

import React, { PropTypes } from "react";
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import FormattedAsset from "app/components/elements/FormattedAsset";
import assetUtils from "app/utils/Assets/AssetsUtils";
import g from 'app/redux/GlobalReducer'

class AccountAssets extends React.Component {

    constructor(props) {
        super(props);
    }

    reserveButtonClick(assetName, e) {
        e.preventDefault();
        // this.props.assetReserve(assetName);
    }

    issueButtonClick(assetName, e) {
        e.preventDefault();
        this.props.assetIssue(assetName);
    }

    render() {
        const {account, account_name, assets} = this.props;

        const myAssets = assets
        .map(asset => {
            const description = assetUtils.parseDescription(asset.options.description);
            let desc = description.short_name ? description.short_name : description.main;

            if (desc.length > 100) {
                desc = desc.substr(0, 100) + "...";
            }
            return (
                <tr key={asset.asset_name}>
                    <td><Link to={`/asset/${asset.asset_name}`}>{asset.asset_name}</Link></td>
                    <td style={{maxWidth: "250px"}}>{desc}</td>
                    {/*<td>{<FormattedAsset amount={parseInt(asset.dynamic_data.current_supply, 10)} asset={asset} />}</td>*/}
                    <td>{<FormattedAsset amount={parseInt(asset.options.max_supply, 10)} asset={asset} />}</td>
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
                            ? (<button onClick={this.reserveButtonClick.bind(this, asset.asset_name)} className="tiny button slim" disabled={true}>
                                    {tt('account_assets_jsx.asset_reserve')}
                                </button>)
                            : null
                        }
                    </td>
                    <td>
                        <Link to={`/@${account_name}/update-asset/${asset.asset_name}`} className="tiny button slim">
                            {tt('account_assets_jsx.asset_update')}
                        </Link>
                    </td>
                </tr>
            );
        });

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

        assetIssue: (assetName) => {
            dispatch(g.actions.showDialog({name: 'issue_asset', params: {assetName}}));
        },

        assetReserve: () => {
            dispatch(g.actions.showDialog({name: 'asset_issue', params: {}}));
        },
    })
)(AccountAssets)

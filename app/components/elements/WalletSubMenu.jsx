import React, { PropTypes } from 'react'
import { Link } from 'react-router';
import { connect } from 'react-redux'
import user from 'app/redux/User'
import NotifiCounter from 'app/components/elements/NotifiCounter';
import tt from 'counterpart';

class WalletSubMenu extends React.Component {
    static propTypes = {
        account_name: PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.showLogin = this.showLogin.bind(this)
    }

    showLogin = (e) => {
        e.preventDefault();
        this.props.showLogin({username: this.props.account_name, authType: 'active'});
    };

    render() {
        const { account_name } = this.props;

        return (
            <div className="row">
                <div className="columns small-10 medium-12 medium-expand left-column">
                    <ul className="WalletSubMenu menu">
                        <li>
                            <Link to={`/@${account_name}/transfers`} activeClassName="active">
                                {tt('g.balances')} <NotifiCounter fields="send,receive" />
                            </Link>
                        </li>
                        <li>
                            <Link to={`/@${account_name}/permissions`} activeClassName="active">
                                {tt('g.permissions')} <NotifiCounter fields="account_update" />
                            </Link>
                        </li>
                        <li>
                            <Link to={`/@${account_name}/password`} activeClassName="active">{tt('g.password')}</Link>
                        </li>
                        <li>
                            <Link to={`/@${account_name}/invites`} activeClassName="active">{tt('g.invites')}</Link>
                        </li>
                    </ul>
                </div>
                <div className="columns shrink right-column">
                    <ul className="WalletSubMenu menu">
                        <li>
                            <Link to={`/@${account_name}/assets`} /* onClick={this.showLogin} */ activeClassName="active" >{tt('g.advanced')}</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default connect(
    (state, ownProps) => ownProps,
    dispatch => ({
        showLogin: ({username, authType}) => {
            dispatch(user.actions.showLogin({loginDefault: {username, authType}}))
        }
    })

)(WalletSubMenu)

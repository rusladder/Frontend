import React from 'react';
import { Link } from 'react-router';
import { translate } from 'app/Translator';


export default ({account_name}) => {
    return <ul className="WalletSubMenu menu">
        <li>
            <Link to={`/@${account_name}/transfers`} activeClassName="active">
                {translate('balances')}
            </Link>
        </li>
        <li>
            <Link to={`/@${account_name}/permissions`} activeClassName="active">
                {translate('permissions')}
            </Link>
        </li>
        <li>
            <Link to={`/@${account_name}/password`} activeClassName="active">{translate('password')}</Link>
        </li>
    </ul>
}

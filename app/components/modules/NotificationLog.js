import React from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router';
import tt from 'counterpart';


class NotificationHistory extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div className="row">
        <div className="column small-12 medium-3 NotificationHistory_column" /*style={{background: 'green'}}*/>
          <div className="NotificationHistory_card NotificationHistory_card-summary">
            <span>
              Краткая информация
            </span>
          </div>
        </div>
        <div className="column small-12 medium-6 NotificationHistory_column">
          <div className="NotificationHistory_card NotificationHistory_card-nlog">
            <div className="row">
              <div className="column medium-12">
                <ul className="menu NotificationHistory_submenu-select-by-type">
                  <li>
                    <Link to={`/@a153048/transfers`} activeClassName="active">
                      {tt('NotificationLog_jsx.selector_menu_type_all')}
                    </Link>
                  </li>
                  <li>
                    <Link to={`/@a153048/permissions`} activeClassName="active">
                      {tt('NotificationLog_jsx.selector_menu_type_comments')}
                    </Link>
                  </li>
                  <li>
                    <Link to={`/@a153048/password`} activeClassName="active">
                      {tt('NotificationLog_jsx.selector_menu_type_transfers')}
                    </Link>
                  </li>
                  <li>
                    <Link to={`/@a153048/password`} activeClassName="active">
                      {tt('NotificationLog_jsx.selector_menu_type_upvotes')}
                    </Link>
                  </li>
                  <li>
                    <Link to={`/@a153048/password`} activeClassName="active">
                      {tt('NotificationLog_jsx.selector_menu_type_downvotes')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="column small-12 medium-3 NotificationHistory_column" /*style={{background: 'green'}}*/>
          <div className="NotificationHistory_card NotificationHistory_card-summary">
            <span>
              Топ авторы
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    return {
      ...ownProps
    }
  },
  // mapDispatchToProps
  dispatch => ({})
)(NotificationHistory)

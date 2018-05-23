import React from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router';
import tt from 'counterpart';
//
const ipsum1 = (
  <span>
        Lorem ipsum dolor sit amet, ultrices sodales suspendisse ut semper sit nec, eget vitae morbi,
    senectus curae risus leo urna. Lacinia lectus proin adipiscing nec eu neque.
    At lacus, wisi sagittis neque purus feugiat neque amet, nunc id aliquam felis,
    amet lorem venenatis posuere faucibus integer arcu, proin nam porttitor.
    Rerum eget et wisi, laoreet vestibulum. Sem non, magna turpis pretium suspendisse,
    pede curae risus eu habitasse quis nam. Nisl vestibulum in sed, mi duis ipsum magna enim,
    feugiat pellentesque leo, imperdiet aliquam et rutrum lorem. Etiam ornare phasellus qui.
    Blandit ut, enim sed, bibendum erat feugiat quis.
  </span>)
//
const ipsum2 = (
  <span>
        Viverra risus imperdiet sapien purus a.
    Mauris tristique dui ullamcorper pellentesque tortor rutrum, enim quisque venenatis lacus nec elit.
    Aliquet urna aenean ultricies donec venenatis. Morbi ut faucibus libero imperdiet auctor,
    leo aenean, maecenas amet vel et in porttitor ac,
    ornare nibh in nonummy ut bibendum ligula, erat odio ipsum euismod nunc qui.
  </span>)

//

const Card = ({title, content, twClass = '', cwClass = ''} = {}) => (
  <div className="NotificationHistory_card">
    <div className={twClass}>
      {title}
    </div>
    <div className={cwClass}>
      {content}
    </div>
  </div>
)
//
const t1 = (
  <span>
    <b>
      Краткая информация
    </b>
</span>
)
//
const t2 = (
  <span>
    <b>
      Топ авторов
    </b>
</span>
)


class NotificationLog extends React.Component {
  //
  constructor() {
    super()
  }

  //
  get log() {
    //
    const menu = (
      <div className="columns shrink">
        <ul className="menu" style={{flexWrap: 'wrap'}}>
        <li>
          <Link to={`/@a153048/notifications`} activeClassName="active">
            {tt('NotificationLog_jsx.selector_menu_type_all')}
          </Link>
        </li>
        <li>
          <Link to={`/@a153048/notifications/comments`} activeClassName="active">
            {tt('NotificationLog_jsx.selector_menu_type_comments')}
          </Link>
        </li>
        <li>
          <Link to={`/@a153048/notifications/transfers`} activeClassName="active">
            {tt('NotificationLog_jsx.selector_menu_type_transfers')}
          </Link>
        </li>
        <li>
          <Link to={`/@a153048/notifications/upvotes`} activeClassName="active">
            {tt('NotificationLog_jsx.selector_menu_type_upvotes')}
          </Link>
        </li>
        <li>
          <Link to={`/@a153048/notifications/downvotes`} activeClassName="active">
            {tt('NotificationLog_jsx.selector_menu_type_downvotes')}
          </Link>
        </li>
      </ul>
      </div>
    )
    //
    return (
      <Card
          title={menu}
          twClass="titleWrapper noPadding center"
          content={ipsum1}
          cwClass="contentWrapper"

      />
    )
  }

  //
  render() {
    return (
      <div className="row">
        <div className="column small-12 medium-3 NotificationHistory_column" /*style={{background: 'green'}}*/>
          <Card
              title={t1}
              twClass="titleWrapper upper"
              content={ipsum1}
              cwClass="contentWrapper"
          />
        </div>
        <div className="column small-12 medium-6 NotificationHistory_column">
          {this.log}
        </div>
        <div className="column small-12 medium-3 NotificationHistory_column" /*style={{background: 'green'}}*/>
          <Card
            title={t2}
            twClass="titleWrapper upper"
            content={ipsum2}
            cwClass="contentWrapper"
          />
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
)(NotificationLog)

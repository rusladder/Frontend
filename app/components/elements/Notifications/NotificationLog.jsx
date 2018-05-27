import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import tt from 'counterpart';
import notificationLogItem from 'app/components/elements/Notifications/NotificationLogItem';

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
//
class NotificationLog extends React.Component {
  //
  constructor() {
    super()
  }

  //
  get menu() {
    // todo optimize this
    const {
      activeMenuItem: active,
      currentUserId
    } = this.props;
    //
    return (
      <div className="columns shrink">
        <ul className="menu" style={{flexWrap: 'wrap'}}>
          <li key={0}>
            <Link to={`/@${currentUserId}/notifications`} className={(active === 'all' || !active) ? 'active' : ''}>
              {tt('NotificationLog_jsx.selector_menu_type_all')}
            </Link>
          </li>
          <li key={1}>
            <Link to={`/@${currentUserId}/notifications?type=comment`} className={active === 'comment' ? 'active' : ''}>
              {/*<Link to={`/@a153048/notifications`} activeClassName="active">*/}
              {tt('NotificationLog_jsx.selector_menu_type_comments')}
            </Link>
          </li>
          <li key={2}>
            <Link to={`/@${currentUserId}/notifications?type=transfer`}
                  className={active === 'transfer' ? 'active' : ''}>
              {/*<Link to={`/@a153048/notifications`} activeClassName="active">*/}
              {tt('NotificationLog_jsx.selector_menu_type_transfers')}
            </Link>
          </li>
          <li key={3}>
            <Link to={`/@${currentUserId}/notifications?type=upvote`} className={active === 'upvote' ? 'active' : ''}>
              {/*<Link to={`/@a153048/notifications`} activeClassName="active">*/}

              {tt('NotificationLog_jsx.selector_menu_type_upvotes')}
            </Link>
          </li>
          <li key={4}>
            <Link to={`/@${currentUserId}/notifications?type=downvote`}
                  className={active === 'downvote' ? 'active' : ''}>
              {/*<Link to={`/@a153048/notifications`} activeClassName="active">*/}

              {tt('NotificationLog_jsx.selector_menu_type_downvotes')}
            </Link>
          </li>
        </ul>
      </div>
    )
  }

  //
  get log() {
    const {fetching, list} = this.props;
    console.log('====================== ', list)
    return (
      !fetching && list && (
        list.map(item => notificationLogItem(item))
      )
    )
  }

  //
  render() {
    const {fetching} = this.props;
    return (
      <div className="row">

        <div className="column small-12 medium-3 nlog_column">
          <div className={'golos-card'}>
            <div className={'golos-card__item'}>
              <div style={{
                padding: '0 1rem',
                display: 'flex',
                alignItems: 'center',
                minHeight: '3rem',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {t1}
              </div>
            </div>
            <div className={'golos-card__item'}>
              <div className={'golos-card__divider_horizontal'}></div>
            </div>
            <div className={'golos-card__item golos-card__item_color-light-grey golos-card_padding-all'}>
              {ipsum1}
            </div>
          </div>
        </div>

        <div className="column small-12 medium-6 nlog_column">
          <div className={'golos-card'}>
            <div className={'golos-card__item'}>
              <div style={{minHeight: '3rem'}}>
                {this.menu}
              </div>
            </div>
            <div className={'golos-card__item'}>
              <div className={'golos-card__divider_horizontal'}></div>
            </div>
            <div className={'golos-card__item'}>
              {this.log}
            </div>
          </div>


          {/*{this.log}*/}
          {/*{fetching && (*/}
          {/*<div className="row" style={{justifyContent: 'center', alignItems: 'center', padding: '10rem'}}>*/}
          {/*<div style={{color: '#d3d3d3'}} className="la-ball-clip-rotate-multiple la-3x">*/}
          {/*<div></div>*/}
          {/*<div></div>*/}
          {/*</div>*/}
          {/*</div>*/}
          {/*)}*/}
        </div>
        <div className="column small-12 medium-3 nlog_column">
          <div className={'golos-card'}>
            <div className={'golos-card__item'}>
              <div style={{
                padding: '0 1rem',
                display: 'flex',
                alignItems: 'center',
                minHeight: '3rem',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {t2}
              </div>
            </div>
            <div className={'golos-card__item'}>
              <div className={'golos-card__divider_horizontal'}></div>
            </div>
            <div className={'golos-card__item golos-card__item_color-light-grey golos-card_padding-all'}>
              {ipsum2}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
//
export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const activeMenuItem = state.user.getIn(['notifications', 'selector'])
    const fetching = state.user.getIn(['notifications', 'fetching'])
    const currentUserId = state.user.getIn(['current', 'username'])
    const list = state.user.getIn(['notifications', 'list'])

    return {
      fetching,
      activeMenuItem,
      currentUserId,
      list,
      ...ownProps
    }
  },
  // mapDispatchToProps
  dispatch => ({})
)(NotificationLog)

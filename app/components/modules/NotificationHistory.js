import React from 'react';
import {connect} from 'react-redux';

class NotificationHistory extends React.Component {

  constructor() {
    super()
  }

  render() {
    return (<div className="row">
      <div className="column small-12 medium-4 medium-text-center" /*style={{background: 'green'}}*/>
        <div style={{/*background: 'red', */display: 'flex', flexDirection: 'column'}}>
          <span className="NotificationHistory_category-button" style={{marginTop: 0}}>Все</span>
          <span className="NotificationHistory_category-button">Переводы</span>
          <span className="NotificationHistory_category-button">Комментарии</span>
          <span className="NotificationHistory_category-button">Апвоуты</span>
          <span className="NotificationHistory_category-button">Флаги</span>
        </div>
      </div>
      <div className="column small-12 medium-8" style={{background: 'yellow'}}>
        RIGHT
      </div>
    </div>)
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

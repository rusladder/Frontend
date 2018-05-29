export default [
  {
    action: 'NOTIFY_STARTED',
    reducer: state => state.setIn(['notifications', 'started'], true)
  },
  {
    action: 'NOTIFY_PAGE_MENU_SELECTOR_SET',
    reducer: (state, {payload}) => state.setIn(['notifications', 'page', 'menu', 'selector'], payload)
  },
  {
    action: 'NOTIFY_HEADER_COUNTER_SET',
    reducer: (state, {payload}) => state.setIn(['notifications', 'header', 'counter'], payload)
  },
  {
    action: 'NOTIFY_REQUEST_DATA_FETCH',
  },
  {
    action: 'NOTIFICATIONS_LIST_CHANGED',
    reducer: (state, {payload}) => {
      // fexme type's redundant for now
      const {type, list} = payload
      state = state.setIn(['notifications', 'list'], list)
      return state
    }
  },
//
  {
    action: 'NOTIFICATIONS_FETCHING',
    reducer: (state, {payload}) => {
      // fexme type's redundant for now
      state = state.setIn(['notifications', 'fetching'], payload)
      return state
    }
  },
]


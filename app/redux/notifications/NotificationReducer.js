export default [
  {
    action: 'NOTIFY_STARTED',
    reducer: state => state.setIn(['notifications', 'started'], true)
  },
  {
    action: 'NOTIFY_HEADER_COUNTER_SET',
    reducer: (state, {payload}) => state.setIn(['notifications', 'header', 'counter'], payload)
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
  {
    action: 'NOTIFICATIONS_SELECTOR_CHANGED',
    reducer: (state, {payload}) => {
      // fexme type's redundant for now
      console.log('NOTIFICATIONS_SELECTOR_CHANGED ', payload)
      state = state.setIn(['notifications', 'selector'], payload)
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


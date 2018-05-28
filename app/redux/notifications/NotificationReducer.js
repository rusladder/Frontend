export default [
  {
    action: 'NOTIFY_STARTED',
    reducer: state => state.setIn(['notifications', 'started'], true)
  },
  {
    action: 'NOTIFICATIONS_UNTOUCHED_COUNTER_CHANGED',
    reducer: (state, {payload}) => {
      const {count} = payload
      state = state.setIn(['notifications', 'untouched_count'], count)
      return state
    }
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


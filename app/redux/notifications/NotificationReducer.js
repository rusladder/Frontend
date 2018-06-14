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
        reducer: (state, {payload}) => {
            // return state.setIn(['notifications', 'header', 'counter'], payload

            console.log('*************************** ', payload)

            return state.setIn(['notifications', 'totals'], payload)
        }
    },
    {
        action: 'NOTIFY_REQUEST_DATA_FETCH',
    },
    {
        action: 'NOTIFICATIONS_LIST_CHANGED',
        reducer: (state, {payload}) => {
            // console.log('!!!!!!!!!!!!!!!!!!!!! ', payload)
            state = state.updateIn(['notifications', 'list'], arr => {
                arr = arr || [];
                arr = [...arr, ...payload]
                arr.sort((a, b) => b.timestamp - a.timestamp);
                return arr;
            })

            // state = state.setIn(['notifications', 'list'], list)

            // fexme type's redundant for now
            // const {type, list} = payload


            // sort by timestamp descending
            // list.sort((a, b) => b.timestamp - a.timestamp);
            //
            return state
        }
    },
    {
        action: 'NOTIFY_LIST_UPDATE',
        reducer: (state, {payload}) => {
            // fexme type's redundant for now
            const {list} = payload
            console.log('/////////// ', payload)
            return state
        }
    },

//
    {
        action: 'NOTIFICATIONS_FETCHING',
        reducer: (state, {payload}) => {
            // fixme type's redundant for now
            state = state.setIn(['notifications', 'fetching'], payload)
            return state
        }
    },
]


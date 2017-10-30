import { Map } from 'immutable';
import createModule from 'redux-modules';

export default createModule({
    name: 'market',
    initialState: Map({status: {}}),
    transformations: [
        {
            action: 'RECEIVE_ORDERBOOK',
            reducer: (state, action) => {
                return state.set('orderbook', action.payload);
            }
        },
        {
            action: 'RECEIVE_TICKER',
            reducer: (state, action) => {
                return state.set('ticker', action.payload);
            }
        },
        {
            action: 'RECEIVE_OPEN_ORDERS',
            reducer: (state, action) => {
                return state.set('open_orders', action.payload);
            }
        },
        {
            action: 'RECEIVE_CALL_ORDERS',
            reducer: (state, action) => {
                return state.set('call_orders', action.payload);
            }
        },
        {
            action: 'RECEIVE_TRADE_HISTORY',
            reducer: (state, action) => {
                return state.set('history', action.payload);
            }
        },
        {
            action: 'APPEND_TRADE_HISTORY',
            reducer: (state, action) => {
                return state.set('history', [...action.payload, ...state.get('history')]);
            }
        },
		{
			action: 'SET_QUOTE_ASSET',
			reducer: (state, action) => {
				return state.set('quote_asset', action.payload);
			}
		},
    ]
});

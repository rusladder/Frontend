import createModule from 'redux-modules';
import { Map } from 'immutable';

const defaultState = {
    assets: {},
    asset: null,
    core: Map(),
    issuer_assets: Map()
};

export default createModule({
    name: 'assets',
    initialState: defaultState,
    transformations: [
        {
            action: 'RECEIVE_ASSETS',
            reducer: (state, {payload}) => {
                return state.set('assets', payload)
            }
        },
        {
            action: 'RECEIVE_CORE_ASSET',
            reducer: (state, {payload}) => {
                return state.set('core', payload)
            }
        },
        {
            action: 'SET_RECEIVED_ASSET',
            reducer: (state, {payload}) => {
                return state.set('asset', payload)
            }
        },
        {
            action: 'RECEIVE_ISSUER_ASSETS',
            reducer: (state, {payload}) => {
                return state.set('issuer_assets', payload)
            }
        },

    ]
});

import createModule from 'redux-modules';
import {fromJS, Map} from 'immutable';

import {immutableCore, global_object} from 'app/utils/Assets/assets_fake_data';

const defaultState = {
    assets: {},
    asset: {},
    core: Map(),
    received : null
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
                return state.set('received', payload)
            }
        },

    ]
});

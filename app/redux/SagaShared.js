import {fromJS} from 'immutable'
import {call, put, select} from 'redux-saga/effects';
import g from 'app/redux/GlobalReducer'
import {takeEvery} from 'redux-saga';
import tt from 'counterpart';
import {api} from 'golos-js';

const wait = ms => (
    new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
);

export const sharedWatches = [watchGetState, watchTransactionErrors]

export function* getAccount(username, force = false) {
    let account = yield select(state => state.global.get('accounts').get(username))
    if (force || !account) {
        [account] = yield call([api, api.getAccountsAsync], [username])
        if(account) {
            const balances = yield call([api, api.getAccountBalancesAsync], username, ['GBG', 'GOLOS']);
            if (balances.length === 2) {
                const sbd_balance = balances[0].indexOf('GBG') ? balances[0] : balances[1];
                const balance = balances[1].indexOf('GOLOS') ? balances[1] : balances[0];

                account.sbd_balance = sbd_balance;
                account.balance = balance;
            }

            account = fromJS(account)
            yield put(g.actions.receiveAccount({account}))
        }
    }
    return account
}

/**with state mutation */
export function* getAccountBalances (state, account) {
    const balances = yield call([api, api.getAccountBalancesAsync], account, ['GBG', 'GOLOS']);

    if (balances.length === 2) {
        const sbd_balance = balances[0].indexOf('GBG') ? balances[0] : balances[1];
        const balance = balances[1].indexOf('GOLOS') ? balances[1] : balances[0];

        state.accounts[account].sbd_balance = sbd_balance;
        state.accounts[account].balance = balance;
    }

    return state;
}

export function* watchGetState() {
    yield* takeEvery('global/GET_STATE', getState);
}
/** Manual refreshes.  The router is in FetchDataSaga. */
export function* getState({payload: {url}}) {
    try {
        let state = yield call([api, api.getStateAsync], url);

        const accounts = Object.keys(state.accounts);
        if (accounts.length > 0) {
            const name = accounts[0];
            state = yield call(getAccountBalances, state, name);
        }

        yield put(g.actions.receiveState(state));
    } catch (error) {
        console.error('~~ Saga getState error ~~>', url, error);
        yield put({type: 'global/CHAIN_API_ERROR', error: error.message});
    }
}

export function* watchTransactionErrors() {
    yield* takeEvery('transaction/ERROR', showTransactionErrorNotification);
}

function* showTransactionErrorNotification() {
    const errors = yield select(state => state.transaction.get('errors'));
    for (const [key, message] of errors) {
        yield put({type: 'ADD_NOTIFICATION', payload: {key, message}});
        yield put({type: 'transaction/DELETE_ERROR', payload: {key}});
    }
}

export function* getContent({author, permlink, resolve, reject}) {
    const content = yield call([api, api.getContentAsync], author, permlink);
    yield put(g.actions.receiveContent({content}))
    if (resolve && content) {
        resolve(content);
    } else if (reject && !content) {
        reject();
    }
}

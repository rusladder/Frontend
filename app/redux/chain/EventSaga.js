import {call, put, select, fork} from 'redux-saga/effects';

const touched = [];


export default function* watchMessages(msgSource) {
  let message = yield call(msgSource.nextMessage)
  const currentUser = yield select(state => state.user.get('current'));
  const username = currentUser.get('username')

  while (message) {
    //
    let data;
    //
    try {
      data = JSON.parse(message)
    } catch (e) {
      message = yield call(msgSource.nextMessage)
    }

    //
    const {id, result} = data;
    //
    // // const currentTrxId;
    if (id >= 2) {
      // transactions
      // debounce duplicates (bug!)
      // block operations
      if (result.length > 0) {
        for(let trx of result) {
          const {trx_id, op} = trx;
          if (!touched.includes(trx_id)) {
            touched.push(trx_id)
          //  process operation here
            const [type, payload] = op;
            console.log(type);
            // console.log(payload)
            if (type === 'transfer') {
              const {to, from, amount} = payload;
              if (to === username) {
                yield put({
                  type: 'ADD_NOTIFICATION',
                  payload: {
                    key: "chain_" + Date.now(),
                    message: `User ${from} transferred you ${amount}`,
                    dismissAfter: 5000
                  }})



              }
            }
            if (type === 'vote') {
              const {voter, author, permlink} = payload;
              if (voter !== username) {
                if (author === username) {
                  yield put({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                      key: "chain_" + Date.now(),
                      message: `User ${voter} has voted your post ${permlink}`,
                      dismissAfter: 5000
                    }})
                }
              }
            }
            if (type === 'comment') {
              const {
                parent_author,
                parent_permlink,
                author,
                permlink
              } = payload;
              //
              if (parent_author.length !== 0) {
                if (parent_author === username) {
                  yield put({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                      key: "chain_" + Date.now(),
                      message: `User ${author} has commented your post ${parent_permlink} with comment ${permlink}`,
                      dismissAfter: 5000
                    }})
                }
              }
            }
          }
          else {
            touched.splice(touched.indexOf(trx_id), 1);
          }
        }
      }
    }


    message = yield call(msgSource.nextMessage)
  }
}

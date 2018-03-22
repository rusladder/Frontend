import {call, put, select, fork} from 'redux-saga/effects';

const touched = [];


export default function* watchMessages(msgSource) {
  console.log('------------------------- begin receive messages')
  let message = yield call(msgSource.nextMessage)
  const currentUser = yield select(state => state.user.get('current'));
  const username = currentUser.get('username')

  console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^`)
  console.log(username)

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
            console.log(payload)
            if (type === 'transfer') {
              const {to, from, amount} = payload;
              if (to === username) {
                yield put({
                  type: 'ADD_NOTIFICATION',
                  payload: {
                    key: "chain_" + Date.now(),
                    message: `User ${from} transferred you ${amount}`,
                    dismissAfter: 3000
                  }})



              }
            }



          }
          else {
            console.log(`BLAAAAAAAAAAAAAAAAA`)
            touched.splice(touched.indexOf(trx_id), 1);
          }
        }

        console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@`)
        console.log(touched)

      }
    }


    message = yield call(msgSource.nextMessage)
  }
  console.log('------------------------- done receive messages')
}

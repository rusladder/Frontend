import {call} from 'redux-saga/effects';

export default function* watchMessages(msgSource) {
  console.log('------------------------- begin receive messages')
  let message = yield call(msgSource.nextMessage)
  while (message) {
    console.log(message)
    message = yield call(msgSource.nextMessage)
  }
  console.log('------------------------- done receive messages')
}

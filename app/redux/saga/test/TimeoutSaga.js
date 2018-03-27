import { take, put, call } from 'redux-saga/effects'
import { eventChannel, END } from '../channel/channel'

// creates an event Channel from an interval of seconds
function countdown(secs) {
  return eventChannel(emitter => {

    console.log(`@@@@@@@@@@@@@@@@@@@@ emitter`)

      const iv = setInterval(() => {
        secs -= 1
        if (secs > 0) {
          console.log(`++++++++++ timer ${secs}`)
          // console.log(emitter)
          emitter(secs)
        } else {
          // this causes the channel to close
          emitter(END)
        }
      }, 1000);
      // The subscriber must return an unsubscribe function
      return () => {
        clearInterval(iv)
      }
    }
  )
}


export default function* saga() {
  console.log(`<<<<<<<<<<<< time saga!`)
  const chan = yield call(countdown, 5)
  console.log(chan)
  try {
    while (true) {
      console.log(`blaaaaaaaaaaaaaaaaaaaaaaaa`)
      console.log(chan)
      // take(END) will cause the saga to terminate by jumping to the finally block
      let seconds = yield take(chan)
      console.log(`--------------------- countdown: ${seconds}`)
    }
  } finally {
    console.log('<-------------- countdown terminated >')
  }
}

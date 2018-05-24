import {takeLatest} from 'redux-saga';
import {take, call, put, select, fork, cancel, } from 'redux-saga/effects';
import {SagaCancellationException} from 'redux-saga';
import user from 'app/redux/User'
import client from 'socketcluster-client';
import NotifyContent from 'app/components/elements/Notifications/NotifyContent'
import {getNotificationsCount, getNotificationsList} from 'app/utils/ServerApiClient';
import {fetchState} from "../FetchDataSaga";
import {routeRegex} from 'app/ResolveRoute'
//
let socket;

//
function socketEventIterator(channel) {
  let resolveNextValue, resolved;
  resolved = true;
  // const socket = client.create(options);
  const chan = socket.subscribe(channel);
  // fixme saga reloading on login
  // this subscribes twice causing event doubling
  chan.watch(
    event => {
      // console.log(`----------------------------------------- `, event)
      resolveNextValue(event);
      resolved = true;
    })
  //
  return () => {
    if (!resolved) {
      throw new Error('Iterator can be used by only one agent.');
    }
    //
    resolved = false;
    //
    return new Promise((resolve) => {
      resolveNextValue = resolve;
    });
  };
}

//
function* userChannelListener(channel) {
  try {
    const next = yield call(socketEventIterator, channel)
    // yield fork(logoutListener)
    while (true) {
      const action = yield call(next);
      if ('type' in action) {
        console.clear()
        yield console.log(action)
        yield put({
          type: 'ADD_NOTIFICATION',
          payload: NotifyContent(action)
        })
      }
      else {
        if (action.operations.length > 0) {
          yield console.log(action)
        }
      }
    }
  } catch (error) {
    // the way redux-saga 0.9.5 catches an effect cancellation
    // or simply using `isCancelError(error)`
    if (error instanceof SagaCancellationException) {
      // clear everything here!
      socket.unsubscribe(channel)
      socket.destroy()
    }
  }
}

//
function onConnectedError(e) {
  console.clear()
  console.log(`<<< notification channel's down. Reconnecting ...`)
}

//
function onConnectedClose(e) {
  console.clear()
  console.log(`<<< notification channel's down. Reconnecting ...`)
}

//
function initConnection(user, scOptions) {
  // console.log(`|||| channel requested for user `, user)
  // console.log(`|||| initializing SCluster client ...`)
  socket = client.create(scOptions);
  return new Promise((resolve, reject) => {
    const onSocketConnect = e => {
      socket.off('connect', onSocketConnect)
      socket.on('error', onConnectedError)
      socket.on('close', onConnectedClose)
      resolve(e)
    }
    const onSocketError = e => {
      socket.off('error', onSocketConnect)
      reject(e)
      return
    }
    socket.on('connect', onSocketConnect)
    socket.on('error', onSocketError)
  })
}

//
function* processLogout() {
  // console.log(`||||||||||||||||||||||||||||||||||| LOGOUT`)
  yield socket.destroy();
  yield put(user.actions.notificationChannelDestroyed())
  // console.log('|||| SCClient destroyed!')
}

// listen to logout only after successful login
function* logoutListener(tasks) {
  yield take('user/LOGOUT'/*, processLogout*/);

  for (const task of tasks) {
    yield cancel(task)
  }

  yield processLogout()
}
//
function* onRouteChange(location_change_action) {
  const {pathname, query} = location_change_action.payload;
  const [,, section] = pathname.match(routeRegex.UserProfile2);
  console.log(query)
  //
  if (section === 'notifications') {
    //
    let type = 'all'
    if ('type' in query) {
      type = query.type;
    }
    console.log('------> put NOTIFICATIONS_FETCH')
    yield put(user.actions.notificationsSelectorChanged(type));
    yield put({type: 'NOTIFICATIONS_FETCH', payload: {type}});
  }
}
//
function* routerListener() {
  yield* takeLatest('@@router/LOCATION_CHANGE', onRouteChange);
}
//
function* fetchNotifications({payload}) {
  const {type} = payload
  const account = yield select(state => state.user.get('current').get('username'));
  yield put(user.actions.notificationsFetching(true));
  const list = yield getNotificationsList({account, type})
  console.log('-------> fetched ', list)
  yield put(user.actions.notificationsFetching(false));
  yield put(user.actions.notificationsListChanged(list));
}
//
function* fetchListener() {
  yield* takeLatest('NOTIFICATIONS_FETCH', fetchNotifications);
}
//
function* onUserLogin() {
  const _fetchListener = yield fork(fetchListener)
  const _routerListener = yield fork(routerListener)
  console.log(`||||||||||||||||||||||||||||||||||| STARTING CHANNEL LISTENER `)
  const currentUser = yield select(state => state.user.get('current'));
  const currentUserId = currentUser.get('username');
  const channelName = currentUserId;
  const pushServiceUrl = yield select(state => state.offchain.get('config').get('push_server_url'));
  //
  const count = yield getNotificationsCount(currentUserId)
  // refresh the bell counter first
  yield put(user.actions.notificationsUntouchedCounterChanged({count}))
  // then start listening to pushes
  if (channelName && pushServiceUrl) {
    try {
      //
      const scOptions = {
        // hostname: pushServiceUrl,
        // secure: true,
        port: 8000
      };
      // {socketid: ..., ...}
      const response = yield call(initConnection, channelName, scOptions)
      // socket successfully created - notify
      yield put(user.actions.notificationChannelCreated())
      //
      // console.log('|||| socket connected! ', response)
      // start tracking user logout
      const chListener = yield fork(userChannelListener, channelName)
      // listen to logout only after successful login
      yield fork(logoutListener, [chListener, _fetchListener, _routerListener])
      // console.log('|||| channel listener started ...')
    } catch (e) {
      // console.log('||||||||||| socket connection error! ', e)
    }
  }
}

//
export default {
  onUserLogin
}

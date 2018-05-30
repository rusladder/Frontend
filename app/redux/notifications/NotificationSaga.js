import {takeLatest} from 'redux-saga';
import {take, call, put, select, fork, cancel,} from 'redux-saga/effects';
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
      const message = yield call(next);
      const {notifications: {list, untouched_count}} = message;
      yield put(user.actions.notifyHeaderCounterSet(untouched_count))
      console.log(message)


      for (const n of list) {
        yield put({
          type: 'ADD_NOTIFICATION',
          payload: NotifyContent(n)
        })
      }
      // if ('type' in action) {
      //   console.clear()
      //   yield console.log(action)
      //   yield put({
      //     type: 'ADD_NOTIFICATION',
      //     payload: NotifyContent(action)
      //   })
      // }
      // else {
      //   if (action.operations.length > 0) {
      //     yield console.log(action)
      //   }
      // }
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
//
//
//
function onSocketConnect(e) {
  console.log(`[x] notification connection established`)
}

//
function onSocketConnectedError(e) {
  const {message} = e;
  console.log('[x] notification connection error : ', message)
}

//
function onSocketConnectedClose(e) {
  console.log(`[x] notification connection closed.`)
}

//
function initConnection(user, scOptions) {
  socket = client.create(scOptions);
  return new Promise((resolve, reject) => {
    //
    const reattachHandlers = () => {
      socket.off('connect', onConnect)
      socket.off('error', onError)
      socket.on('connect', onSocketConnect)
      socket.on('error', onSocketConnectedError)
      socket.on('close', onSocketConnectedClose)
    }
    //
    const onConnect = e => {
      console.log('[xxx] notification connection established')
      reattachHandlers()
      resolve(e)
    }
    //
    const onError = e => {
      console.log('[xxx] notification connection error', e)
      reattachHandlers()
      reject(e)
    }
    socket.on('connect', onConnect)
    socket.on('error', onError)
  })
}

//
function* processLogout() {
  yield socket.destroy();
}

// listen to logout only after successful login
function* logoutListener(tasks) {
  yield take('user/LOGOUT'/*, processLogout*/);
  // cancel all the notification tasks
  for (const task of tasks) {
    yield cancel(task)
  }
  //
  yield processLogout()
}

//
function* fetchNotifications() {
  const type = yield select(state => state.user.getIn(['notifications', 'page', 'menu', 'selector']));
  console.log('@@@@@ fetching ', type)
  const authorized_username = yield select(state => state.user.get('current').get('username'));
  yield put(user.actions.notificationsFetching(true));
  const list = yield getNotificationsList({account: authorized_username, type})
  console.log('@@@@@ fetched')
  yield put(user.actions.notificationsFetching(false));
  yield put(user.actions.notificationsListChanged(list));
}

//
function* fetchRequestListener() {
  yield* takeLatest('NOTIFY_REQUEST_DATA_FETCH', fetchNotifications);
}

//
function* onRouteChange({payload}) {
  const {pathname, query} = payload;
  // track notifications section for an authorized user
  const uProfile = pathname.match(routeRegex.UserProfile2);
  // we're under some user profile route
  if (uProfile) {
    const [, username, section] = uProfile
    // nothing to do in other case
    if (username && section) {
      // get rid of @
      const route_username = username.substring(1)
      // check who's logged in
      const authorized_username = yield select(state => state.user.get('current').get('username'));
      // process only if route belongs to currently authorized user
      const ok = (section === 'notifications') && (route_username === authorized_username);
      //
      if (ok) {
        // notification type selector is in query string
        let {type} = query;
        // let type have a value in any case
        type = type || 'all';
        // set current notifications type
        yield put(user.actions.notifyPageMenuSelectorSet(type));
        yield put({type: 'NOTIFY_REQUEST_DATA_FETCH'})
      }
    }
  }
}

//
function* routerListener() {
  yield* takeLatest('@@router/LOCATION_CHANGE', onRouteChange);
}

//
function* onUserLogin() {
  // first start fetch request listener
  const fetchRequestListenerEffect = yield fork(fetchRequestListener)
  // then check current route on login since @@router/LOCATION_CHANGE has already fired
  // and process route actions if any
  const currentRoute = yield select(state => state.routing.locationBeforeTransitions);
  yield call(onRouteChange, {payload: currentRoute})
  // then start listening to route change normally
  const routerListenerEffect = yield fork(routerListener)
  const authorized_user = yield select(state => state.user.get('current'));
  const authorized_username = authorized_user.get('username');
  const channel_name = authorized_username;
  const push_service_url = yield select(state => state.offchain.get('config').get('push_server_url'));
  //
  const count = yield getNotificationsCount(authorized_username)
  // refresh the bell counter first
  yield put(user.actions.notifyHeaderCounterSet(count))
  // then start listening to pushes
  if (channel_name && push_service_url) {
    try {
      //
      const scOptions = {
        // hostname: pushServiceUrl,
        // secure: true,
        port: 8000
      };
      // {socketid: ..., ...}
      const response = yield call(initConnection, channel_name, scOptions)
      // start listening to user message channel
      const chListener = yield fork(userChannelListener, channel_name)
      // start listening to user logout
      yield fork(logoutListener, [chListener, fetchRequestListenerEffect, routerListenerEffect])
      // client notifications service initialized - let redux know
      yield put(user.actions.notifyStarted())
      //
    } catch (e) {
      // console.log('||||||||||| socket connection error! ', e)
    }
  }
}

//
export default {
  onUserLogin
}

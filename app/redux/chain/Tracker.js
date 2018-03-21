import PersistentWebSocket from 'app/utils/PersistentWebSocket'

console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@`)
console.log(PersistentWebSocket)

export default function tracker(url = 'wss://ws.golos.io') {
  const source = new PersistentWebSocket(url)
  let deferred

  source.onopen = event => {
    source.send(JSON
      .stringify({
        id: 1,
        method: 'call',
        "params": ["database_api", "set_block_applied_callback", [0],]
      }), (e) => {
      if (e) return console.warn(e)
    });
  }

  source.onmessage = event => {
    if (deferred) {
      deferred.resolve(event.data)
      deferred = null
    }
  }

  return {
    nextMessage() {
      if (!deferred) {
        deferred = {}
        deferred.promise =
          new Promise(resolve => deferred.resolve = resolve)
      }
      return deferred.promise
    }
  }
}

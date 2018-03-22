import PersistentWebSocket from 'app/utils/PersistentWebSocket'

export default function tracker(url = 'ws://localhost:8090') {
  const ws = new PersistentWebSocket(url)
  let deferred
  //
  const redKey = "lastblocknumber"
  console.log(`{tracker} started`)
  const client = localStorage
  client.removeItem(redKey);
  // client.setItem(redKey, 14902800);


  const END = "\x1b[0m"
  const RED = "\x1b[31m"
  const GREEN = "\x1b[36m"
  //
  let height = 0
  let next = 0
  let nodeparam = "now"//process.argv.slice(2);
  let getNOW = nodeparam === "now"
  let targetheight = (!isNaN(nodeparam[0])) ? nodeparam[0] : false
  let fheight = 0
  let timestamp = 0
  //
  if (targetheight) {
    fheight = Number(targetheight);
    client.setItem(redKey, fheight);
    targetheight = false;
  }
  //
  const Send = (operations, ProcessedBlockNum, ProcessedOpTime) => {
    let ops = []
    //
    for (let op of operations) {
      ops.push(op.op)
    }
    //
    let JSONops = JSON.stringify(ops)
    let opslength = ops.length
    let delta = height + 1 - ProcessedBlockNum
    let state = (ProcessedBlockNum > height) ? "Realtime" : "🏃 rocessing missed blocks... " + delta + " Left"
    let golostime = Date.parse(timestamp)
    // let ageLastOps = (golostime - ProcessedOpTime) / 1000
    //
    // console.log(`${ProcessedBlockNum} [${height + 1}] ${state} ops count : ${ops.length}`)
    //
    client.setItem(redKey, ProcessedBlockNum);
    if (ProcessedBlockNum <= height) getOps(ProcessedBlockNum + 1, 3)
    // return pub.publish(CHANNEL, JSONops);

    // if (deferred) {
    //   deferred.resolve(ops)
    //   deferred = null
    // }



  }
  //
  const getOps = (sequentBlock, speed) => {
    ws.send(JSON.stringify({
      id: speed,
      method: 'call',
      params: ["database_api", "get_ops_in_block", [sequentBlock, "false"]]
    }), (e) => {
      if (e) return console.warn(e)
    });

  }
  //
  let Tl = D => {
    let txTimes = []
    for (tx of D) {
      txTimes.push(Date.parse(tx.timestamp))
    }
    return Math.max.apply(Math, txTimes);
  }
  //
  ws.onopen = event => {
    ws.send(JSON
      .stringify({
        id: 1,
        method: 'call',
        "params": ["database_api", "set_block_applied_callback", [0],]
      }), (e) => {
      if (e) return console.warn(e)
    });
  }
  //
  ws.onmessage = e => {

    const {data: raw} = e;

    // console.log(`%%%%%%%%%%%%%%%%%%%%%%%`)
    // console.log(raw)

    let data = JSON.parse(raw)
    if (data.method === "notice" && data.params) {
      let hex = data.params[1][0].previous.slice(0, 8)
      height = parseInt(hex, 16)
      timestamp = data.params[1][0].timestamp
      // console.log(`--------------------------`)
      // console.log(`[getNOW] ${getNOW}`)
      // console.log(`[height] ${height}`)
      // console.log(`[fheight] ${fheight}`)
      // not called when started with last remembered block (no cli params)
      if (getNOW || height < fheight) {
        // console.log(`[set redKey] ${height}`)
        client.setItem(redKey, height);
      }
      // get the last processed key from store
      const num = client.getItem(redKey)
      const process = (num) => {
        // console.log(`[get redKey] ${num}`)
        let lastblock = Number(num)
        next = height - 1
        // console.log(`[lastblock] ${lastblock}`)
        // console.log(`[next] ${next}`)
        // the last processed block is stored
        // start counting from it
        if (lastblock) {
          next = lastblock + 1
        }
        // console.log(`[next] ${next}`)
        let delta = height - next
        // console.log(`[delta] ${delta}`)
        // delta = height - next -> next = lastblock +1
        // realtime mode
        if (delta < 0)
          return getOps(next, 2)
        // catch up mode
        else if (lastblock < height)
          // console.log(`<<<<<<<<<<<<<<------------------------------------->>>>>>>>>>>>>>>>`)
        return getOps(next, 3)
      }
      process(num)
    }
    //
    else if (data.id === 2) {
      // let lastTime = Tl(data.result)
      Send(data.result, next, 0)
    }
    //
    else if (data.id === 3) {
      // console.log(`<<<<<<< catch up data`)
      const num = client.getItem(redKey)
      const process = (num) => {
        // console.log(`<< get redKey`)
        let lastblock = Number(num)
        if (lastblock > height) return
        // let lastTime = Tl(data.result)
        // console.log(`<< [lastblock] ${lastblock}`)
        // console.log(`<< [height] ${height}`)
        Send(data.result, lastblock + 1, 0)
      }
      process(num)
    }

    if (deferred) {
      // console.log(`------------------------------`)
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

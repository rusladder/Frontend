
async function proxify(method, context, proxy, /*, options */) {
  const options = [].slice.call(arguments).splice(3);
  const key = method + JSON.stringify(options);
  const methods = ['getStateAsync', 'getDiscussionsByCreatedAsync', 'getDiscussionsByTrendingAsync', 'getDiscussionsByHotAsync'];
  const paths = ['/created','/hot','/trending', '/promoted'];
  let useCache = false, ttl = 30, res = null;

  // if (process.env.NODE_ENV === 'development') {
  //   return await context[method].apply(context, options);
  // }

  // prepare methods and options
  console.log('\x1b[36m%s %s\x1b[0m', method, options[0]);
  if (methods.indexOf(method) == 0 && paths.indexOf(options[0]) !== -1) {
    // prepare now only first method getStateAsync
    useCache = true;

    // getting data from cache
    try {
      const cache = await proxy.call('cache_get', key);
      if (typeof cache === 'object' && cache.length >= 1) {
        res = cache[0][0];
      }
      if (res && res != null) {
        return res;
      }
    } catch (e) {
      console.error('-- /api/v1/proxy/method cache_get error -->', key, e.message);
    }
  }

  // getting data from chain
  if (typeof options[0] !== 'undefined') {
    res = await context[method].apply(context, options);
  }
  else {
    res = await context[method].apply(context);
  }

  if (!useCache) {
    return res;
  }
  // putting data into cache
  try {
    // getting key locks
    let islocked = await proxy.call('cache_islock', key);
    if (typeof islocked === 'object' && islocked.length >= 1) {
      islocked = islocked[0][0];
    }
    // save cache
    if (typeof islocked == 'boolean' && islocked == false) {
      // set specific time to live
      switch (options[0]) {
        case '/created':
          ttl = 180;
          break;
        case '/hot':
        case '/promoted':
          ttl = 600;
          break;
          case '/trending':
          ttl = 900;
          break;
      }
      await proxy.call('cache_set', key, ttl, res);
    }
  } catch (e) {
    console.error('-- /api/v1/proxy/method cache_set error -->', key, e.message);
  }
  return res;
}

export default proxify;

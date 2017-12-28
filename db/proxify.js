
async function proxify(method, context, proxy, lifetime /*, options */) {
  const options = [].slice.call(arguments).splice(4);
  const proxyKey = method + JSON.stringify(options);
  let res = [];

  if (process.env.NODE_ENV === 'development') {
    return await context[method].apply(context, options);
  }

  const start = process.hrtime();
  try {
    console.info("\x1b[32m%s [%s]\x1b[0m", 'cache_get', proxyKey);
    const cache = await proxy.call('chain_get', proxyKey);
    if (typeof cache === 'object' && cache.length >= 1)
      res = cache[0][0];
  }
  catch (e) {
    console.error('-- /api/v1/proxy/method error -->', proxyKey, e.message);
  }
  if (res && res != null) {
    const elapsed = process.hrtime(start);
    console.info("\x1b[42m%s [%s %s]\x1b[0m", 'data from cache', (elapsed[0] * 1e3 + elapsed[1] / 1e6).toFixed(3), 'ms');
    return res;
  }
  else {
    if (typeof options[0] !== 'undefined') {
      res = await context[method].apply(context, options);
    }
    else {
      res = await context[method].apply(context);
    }
    const elapsed1 = process.hrtime(start);
    console.info("\x1b[41m%s [%s %s]\x1b[0m", 'data from chain', (elapsed1[0] * 1e3 + elapsed1[1] / 1e6).toFixed(3), 'ms');
    try {
      await proxy.call('chain_set', proxyKey, lifetime, res);
      const elapsed2 = process.hrtime(start);
      console.info("\x1b[44m%s [%s %s]\x1b[0m", 'data set cache', (elapsed2[0] * 1e3 + elapsed2[1] / 1e6).toFixed(3), 'ms');
    }
    catch (e) {
      console.error('-- /api/v1/proxy/method error -->', proxyKey, e.message);
    }
  }
  return res;
}

export default proxify;

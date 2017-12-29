import koa_router from 'koa-router';
import koa_body from 'koa-body';
import Tarantool from 'db/tarantool';
import { api } from 'golos-js';
import proxify from 'db/proxify';

function proxyRoutes(app) {
  const router = koa_router({prefix: '/api/v1/proxy'});
  app.use(router.routes());
  const koaBody = koa_body();
  const chainproxy = Tarantool.instance('chainproxy');

  router.post('/', koaBody, function* () {
    const params = this.request.body;
    const method = params.method ? params.method : null;
    const args = params.args ? params.args : null;
    if (method && args) {
      this.body = yield proxify(method, api, chainproxy, args);
    }
    else {
      this.body = {status: '404', data: 'Method not found'};
    }
  });
}

module.exports = {
  proxyRoutes
};

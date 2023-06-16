const Server = require('./lib/server.js');
const Router = require('./lib/middleware/router.js');

const router = new Router();

const app = new Server();
app.use(
  router.all(`/test/:course/:lecture`, async ({ route, res }, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.body = route;
  })
);
app.use(async (ctx, next) => {
  const { res } = ctx;
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello World</h1>';

  await next();
});

app.listen({ port: 9090, host: '0.0.0.0' });

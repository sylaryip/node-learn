const Server = require('./lib/cluster-server.js');
const Router = require('./lib/middleware/router.js');

const app = new Server({ instance: 0 });

const router = new Router();

app.use(async (ctx, next) => {
  process.send('count');
  await next();
});

app.use(async (ctx, next) => {
  console.log(`visit ${ctx.req.url} through worker ${app.worker.process.pid}`);
  await next();
});

app.use(
  router.all('.*', async ({ req, res }, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.body = '<h1>Hello World</h1>';
    await next();
  })
);

let count = 0;
process.on('message', (message) => {
  if (message === 'count') {
    count++;
    console.log('visit count: ', count);
  }
});

app.listen({
  port: 9091,
  host: '0.0.0.0',
});

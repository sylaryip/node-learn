const Server = require('./lib/cluster-server.js');
const Router = require('./lib/middleware/router.js');

const app = new Server({ instance: 0 });

const router = new Router();

let count = 0;
process.on('message', (message) => {
  // windows 下使用 pipe 通信, 不是 ipc 所以收不到
  if (message === ' count') {
    count++;
    console.log('visit count: ', count);
  }
});

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

app.listen({
  port: 9090,
  host: '0.0.0.0',
});

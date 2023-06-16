const Interceptor = require('./interceptor.js');
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const inter = new Interceptor();

const task = function (id) {
  return async (ctx, next) => {
    try {
      console.log(`task ${id} start`);

      ctx.count++;
      if (ctx.count === 3) throw new Error('error');

      await wait(1000);

      console.log(`count: ${ctx.count}`);

      await next();
      console.log(`task ${id} end`);
    } catch (ex) {
      console.log(ex.message);
      await next();
    }
  };
};

// 多个任务以拦截切面的方式注册到拦截器中
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));
inter.use(task(5));

inter.run({ count: 0 });

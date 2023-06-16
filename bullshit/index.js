import { interact } from './interact.js';
import { options } from './lib/cmd.js';
import { loadCorpus, saveCorpus } from './lib/corpus.js';
import { generate } from './lib/generator.js';
import { createRandomPick } from './lib/random.js';

const corpus = loadCorpus('./corpus/data.json');
let title = options.title || createRandomPick(corpus.title)();

if (Object.keys(options).length <= 0) {
  const answers = await interact([
    {
      text: '请输入文章主题',
      value: title,
    },
    {
      text: '请输入文章最小字数',
      value: 6000,
    },
    {
      text: '请输入文章最大字数',
      value: 10000,
    },
  ]);

  title = answers[0];
  options.min = answers[1];
  options.max = answers[2];
}
const article = generate(title, { corpus, ...options });
const output = saveCorpus(title, article);

console.log('生成成功！文章保存于：', output);

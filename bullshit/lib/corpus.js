import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import moment from 'moment/moment.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)), '../');
export function loadCorpus(src) {
  const path = resolve(__dirname, src);
  const data = readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(data);
}

export function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, 'output');
  const time = moment().format('x');
  const outputFile = resolve(outputDir, `${title}${time}.txt`);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  const text = `${title}\n\n    ${article.join('\r\n    ')}`;
  writeFileSync(outputFile, text);

  return outputFile;
}

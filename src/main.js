import path from 'path';
import chalk from 'chalk';
import authorize from './archieml-pipe/authorize';
import winston from './archieml-pipe/logging';

const defaults = {
  googleDocId: null,
  googleClientId: null,
  googleClientSecret: null,
  redirectPort: '6006',
  exportPath: path.resolve(process.cwd(), 'data.json'),
  tokenPath: path.resolve(process.cwd(), 'archie-token.json'),
};

const main = (customOptions) => {
  const opts = Object.assign(defaults, customOptions);
  if (!opts.googleDocId || !opts.googleClientId || !opts.googleClientSecret) {
    winston.error(chalk.bgRed('Missing Google connection info.'));
    return;
  }
  authorize(opts);
};

export default main;

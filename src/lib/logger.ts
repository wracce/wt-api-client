import util from 'util';

export const log = (...args: any[]) => {
  for (const arg of args) {
    console.info(util.inspect(arg, { depth: null, colors: true, compact: false }));
  }
};

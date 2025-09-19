// Simple client-side logger wrapper. Replace console.* with a logging service if needed.
const isBrowser = typeof window !== 'undefined';

function format(...args) {
  return args;
}

const info = (...args) => {
  if (isBrowser && console.info) console.info(...format(...args));
  else console.log(...format(...args));
};

const warn = (...args) => {
  if (isBrowser && console.warn) console.warn(...format(...args));
  else console.warn(...format(...args));
};

const error = (...args) => {
  if (isBrowser && console.error) console.error(...format(...args));
  else console.error(...format(...args));
};

const logger = { info, warn, error };
export default logger;

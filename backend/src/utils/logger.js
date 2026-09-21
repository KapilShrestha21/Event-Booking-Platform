const logger = {
  info: (...messages) => {
    console.log('[INFO]', ...messages);
  },

  error: (...messages) => {
    console.error('[ERROR]', ...messages);
  },

  warn: (...messages) => {
    console.warn('[WARN]', ...messages);
  },
};

export default logger;
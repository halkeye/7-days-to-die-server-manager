const { UI, setQueues } = require('bull-board')
const path = require('path');

module.exports = function Sentry(sails) {
  return {
    /**
     * Default configuration
     *
     * We do this in a function since the configuration key for
     * the hook is itself configurable, so we can't just return
     * an object.
     */
    defaults: {
      __configKey__: {
      }
    },

    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function(cb) {
      var settings = sails.config[this.configKey];
      setQueues([
        sails.helpers.getQueueObject('logs'),
      ]);

      sails.after('hook:http:loaded', function () {
        sails.hooks.http.app.use(
          '/admin/queues',
          function(req, res, next) {
            /* Meh auth for static files */
            if (path.resolve(req.originalUrl).startsWith('/admin/queues/static/')) {
              return next();
            }
            return sails.hooks.policies.middleware.isloggedin(req, res, next);
          },
          UI
        );

        // We're done initializing.
        return cb();
      });
    }
  };
};
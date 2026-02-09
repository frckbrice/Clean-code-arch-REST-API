'use strict';

const { log } = require('../middlewares/loggers/logger');

/**
 * Wraps a controller so it receives an HTTP request object and sends the controller response.
 * @param {Function} controller - Async (httpRequest) => httpResponse
 * @returns {Function} Express (req, res) handler
 */
module.exports = (controller) =>
  function responseAdapterHandler(req, res) {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    };

    controller(httpRequest)
      .then((httpResponse) => {
        log.debug('response adapter:', JSON.stringify(httpResponse));
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }

        res
          .type('json')
          .status(httpResponse.statusCode || 400)
          .send(httpResponse.data || 'BAD REQUEST');
      })
      .catch((e) => {
        res
          .type('json')
          .status(e.statusCode || 500)
          .send({ error: e });
      });
  };

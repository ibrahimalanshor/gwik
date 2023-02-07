function t9nMiddleware(req, res, next) {
  req.t = req.app.get('t9n');
  req.t.setLocale(req.headers['accept-language'] || 'en');

  next();
}

module.exports = { t9nMiddleware };

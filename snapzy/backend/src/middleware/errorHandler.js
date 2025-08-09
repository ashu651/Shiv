export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message });
}
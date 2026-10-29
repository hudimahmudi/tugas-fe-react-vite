function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: err.message || 'Terjadi kesalahan pada server' });
}

module.exports = errorHandler;
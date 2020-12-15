// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 404;
  // should the above be '500 rather than 404'
  res.status(status);

  console.log(err);

  res.send({
    status,
    error: err.message
  });
};

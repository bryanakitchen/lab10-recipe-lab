// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = err.status || 500;

  if(err.message.includes('Recipe with id')) {
    status = 404;  
  } 

  res.status(status);

  console.log(err);

  res.send({
    status,
    error: err.message
  });
};

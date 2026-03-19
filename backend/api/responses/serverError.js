/**
   Server Error Response
  This custom response can be used to send a standardized server error response
  Example usage in a controller:
  return res.serverError({ message: 'Something went wrong', data: error });
*/

module.exports = function serverError(data) {

  const res = this.res;
  // Set status code 500
  res.status(500);

  // Send JSON response (you can customize)
  return res.json({
    status: false,
    status_code: 500,
    message: data?.message || 'Internal server error',
    data: process.env.NODE_ENV === 'development'  ? data?.data || null : null // Only include error details in development
  });
};

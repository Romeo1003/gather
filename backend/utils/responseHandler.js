export const responseHandler = {
  success: (data, message = 'Operation successful') => ({
    success: true,
    message,
    data
  }),

  error: (message = 'Operation failed', errors = null) => ({
    success: false,
    message,
    errors
  }),

  serverError: (message = 'Internal server error', error = null) => ({
    success: false,
    message,
    error: error?.message || error
  })
};
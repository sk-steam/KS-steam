const responseHandler = {
    success: (data = null, message = 'Success') => ({
        status: 'success',
        message,
        data
    }),

    error: (message = 'Error occurred', code = 500) => ({
        status: 'error',
        message,
        code
    }),

    pagination: (data, page, limit, total) => ({
        status: 'success',
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    })
};

module.exports = responseHandler;

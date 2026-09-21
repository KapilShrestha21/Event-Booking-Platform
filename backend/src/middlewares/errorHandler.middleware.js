const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    const message = err.message || "Internal server error";

    console.error("Error caught by centralized middleware:\n", err.stack);

    const isDev = process.env.NODE_ENV === "development";

    if(isDev) {
        return res.status(statusCode).json({
            status: statusCode,
            message: message,
            stack: err.stack,
            error: err,
        });
    }

    return res.status(statusCode).json({
        status: statusCode,
        message: err.isOperational ? message : "Something went wrong on our end",
    })

}

export default errorHandler;
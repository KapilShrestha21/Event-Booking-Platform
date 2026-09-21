const handleResponse = (res, status, message, data = null) => {
    const isSuccess = status >= 200 && status < 300;

    res.status(status).json({
        status: isSuccess ? 'success' : 'error',
        statusCode: status,
        message,
        data,
    })
}

export default handleResponse;

/**
 * it send response and data like this to frontend
 * 
 {
    "status": "success",
    "statusCode": 200,
    "message": "Events fetched successfully",
    "data": [
        { "id": 1, "title": "Holi Festival" },
        { "id": 2, "title": "Music Night" }
    ]
}
 */
import pool from "../config/db.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = catchAsync(async (req, res, next) => {
    // extract jwt token comming from frontend httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
        throw new AppError('Unauthorized: Please login in to access this resource', 401)
    }

    let tokenDecode;
    try {
        // verify token
        tokenDecode = verifyToken(token);

    } catch (error) {
        throw new AppError('Invalid or expired token. Please log in again.', 401);
    }


    // fetch fresh, safe user data from database (excluding password)
    // it extract the id form token and attach more data from database to user further
    const { rows } = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [tokenDecode.id]
    )

    const user = rows[0];

    if (!user) {
        throw new AppError('User belonging to this token no longer exists.', 401);
    }

    // attach authenticated user to request context and proceed with payload 
    // req.user now hold id, name, email and role from user table database
    req.user = user;
    next()
})

// role base Authorization Middleware
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        // ensure req.user exists
        if (!req.user) {
            throw new AppError('Unauthorized: You must be logged in', 401);
        }

        // check if user's role exists inside allowedRoles array
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError('Forbidden: You do not have permission to access this resource', 403)
        }

        // role is allowed — continue to controller
        next();
    }
}
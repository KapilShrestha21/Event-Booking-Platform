import bcrypt from "bcrypt";
import pool from "../config/db.js";
import AppError from "../utils/AppError.js";
import { generateToken } from "../utils/jwt.js";
import { FIND_USER_BY_EMAIL, CREATE_USER, DELETE_USER } from "../queries/auth.queries.js";

export const registerService = async ({ name, email, password, role }) => {
    // Check if user already exists
    const existingUser = await pool.query(FIND_USER_BY_EMAIL, [email]);

    if (existingUser.rows.length > 0) {
        throw new AppError('Email is already registered', 409)
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // enforce 'customer' is role isn't provided
    const userRole = role && ['customer', 'organizer'].includes(role) ? role : 'customer';

    try {
        // create user database
        const { rows } = await pool.query(CREATE_USER, [
            name,
            email,
            hashedPassword,
            userRole,
        ]);

        const user = rows[0];

        // remove password form output
        delete user.password;

        // generate jwt token - to automatically login, without this token, the user wouble be force to re-type their email and password
        const token = generateToken({ id: user.id, role: user.role })

        return { user, token };
    } catch (error) {
        // PostgreSQL Unique Constraint Violation safety check for duplicate value (email)
        if (error.code === '23505') {
            throw new AppError('Email is already registered', 409);
        }

        throw error
    }
};

export const loginService = async ({ email, password }) => {
    // find email
    const { rows } = await pool.query(FIND_USER_BY_EMAIL, [email]);
    const user = rows[0];

    if (!user) {
        throw new AppError('Invalid email', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid password", 401);
    }

    // remove password form output
    delete user.password;

    // generate token - to send to frontend
    const token = generateToken({ id: user.id, role: user.role });

    return { user, token }
}

export const deleteUserService = async (userId) => {
    try {
        const { rows, rowCount } = await pool.query(
            DELETE_USER,
            [userId]
        );

        if (rowCount === 0) {
            throw new AppError('User not found', 404);
        }

        return rows[0];

    } catch (error) {
        if (error.code === '23503') {
            throw new AppError(
                'Cannot delete user because they have related events or bookings.',
                409
            );
        }

        throw error;
    }
};

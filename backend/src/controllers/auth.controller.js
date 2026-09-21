import catchAsync from "../utils/catchAsync.js";
import handleResponse from "../utils/handleResponse.js";
import { registerService, loginService, deleteUserService } from "../services/auth.service.js";

// Reusable cookie options to keep login and logout perfectly synced
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};

const register = catchAsync(async (req, res, next) => {

    const { user, token } = await registerService(req.body);

    // result have the value of return object of registerService function not the data req.body have , which comes from frontend...
    // pass req.body data which come from frontend to register the user into registerService function

    res.cookie('token', token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return handleResponse(res, 201, 'User registered successfully', { user });
});

const login = catchAsync(async (req, res, next) => {
    const { user, token } = await loginService(req.body);

    // Set the JWT token inside an HttpOnly cookie
    // backend send token through http header
    /*
    like:
        HTTP/1.1 200 OK
        Set-Cookie: token=eyJhbGciOiJIUzI1NiIs...; HttpOnly

        token will be saved automatically in browser storage
    */
    res.cookie('token', token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000 // expire in 7 days
    })

    return handleResponse(res, 200, "User logged in successfully", { user });
})

const logout = catchAsync(async (req, res, next) => {
    // clear cookies
    res.clearCookie('token', COOKIE_OPTIONS);

    return handleResponse(res, 200, 'Logged out successfully');
})

const deleteUser = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const deletedUser = await deleteUserService(userId);
    res.clearCookie('token', COOKIE_OPTIONS);
    return handleResponse( res, 200, 'User deleted successfully', deletedUser );
})

// return current logged-in user to verify from token in frontend
const getMe = async (req, res, next) => {
    return handleResponse(res, 200, 'User fetched successfully', req.user);
};

export {
    register,
    login,
    logout,
    deleteUser,
    getMe
}
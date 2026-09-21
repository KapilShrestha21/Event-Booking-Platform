import AppError from "../utils/AppError.js";

export const validate = (schema) => {

    return async (req, res, next) => {
        try {
            const validatedData = await schema.parseAsync(req.body);
            req.body = validatedData;
            return next();
        } catch (error) {
            if (error.name === 'ZodError' || error.constructor.name === 'ZodError') {
                const firstError = error.issues[0]?.message || 'Invalid input data';
                return next(new AppError(firstError, 400));
            }

            return next(error);
        }
    };
}


/* -- What does that error of zod object look like?
----- this is throw by zod itself if there is error
const error = {
    name: "ZodError",

    issues: [
        {
            path: ["title"],
            message: "Title is required",
            code: "too_small"
        },
        {
            path: ["price"],
            message: "Price must be positive",
            code: "too_small"
        }
    ]
};
*/
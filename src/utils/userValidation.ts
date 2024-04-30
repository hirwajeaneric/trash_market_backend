import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


export const validateUser = [
    body('firstName')
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 2 })
        .withMessage('First name is required'),
    body('lastName')
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 2 })
        .withMessage('Last name is required'),
    body('email')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    body('phone')
        .isEmpty()
        .withMessage('Invalid phone number'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters with an Upper case character, lower case character, symbol and digit.'),
    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Invalid role value'),
    body('addressLine1').optional().isString(),
    body('addressLine2').optional().isString(),
    body('city').optional().isString(),
    handleValidationErrors
]

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ProductTypes } from '../model/order.model';

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  next();
};

// Helper function to check if all products in the request body have required fields
const hasValidProducts = (products :ProductTypes[]) => {
  return products.every(
    (product) => product.id && typeof product.quantity === 'number' && typeof product.pricePerUnit === 'number'
  );
};

export const validateAddOrder = [
  body('products')
    .custom((products) => {
      if (!products || !products.length) {
        throw new Error('Order must contain at least one product');
      }
      if (!hasValidProducts(products)) {
        throw new Error('Invalid product data in order');
      }
      return true;
    })
    .withMessage('Order must contain at least one valid product'),
  body('totalPrice')
    .isNumeric()
    .withMessage('Total price must be a valid number'),
    handleValidationErrors
];
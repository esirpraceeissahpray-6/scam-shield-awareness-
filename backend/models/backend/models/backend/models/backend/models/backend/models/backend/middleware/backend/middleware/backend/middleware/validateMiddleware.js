const Joi = require('joi');

// Middleware to validate request bodies against a Joi schema
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation error', errors: messages });
  }

  next();
};

module.exports = { validateRequest };

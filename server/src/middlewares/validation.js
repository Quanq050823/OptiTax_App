const Joi = require("joi");

const registerSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	firstName: Joi.string().max(50).required(),
	lastName: Joi.string().max(50).required(),
	phone: Joi.string()
		.pattern(/^[0-9]{10,11}$/)
		.optional(),
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
	firstName: Joi.string().max(50).optional(),
	lastName: Joi.string().max(50).optional(),
	phone: Joi.string()
		.pattern(/^[0-9]{10,11}$/)
		.optional(),
});

const changePasswordSchema = Joi.object({
	currentPassword: Joi.string().required(),
	newPassword: Joi.string().min(6).required(),
});

const validate = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body);

		if (error) {
			const message = error.details[0].message;
			return res.status(400).json({
				success: false,
				message: message,
			});
		}

		next();
	};
};

module.exports = {
	validate,
	registerSchema,
	loginSchema,
	updateProfileSchema,
	changePasswordSchema,
};

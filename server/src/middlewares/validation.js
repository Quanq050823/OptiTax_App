const Joi = require("joi");

const registerSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string()
		.min(6)
		.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/)
		.required()
		.messages({
			"string.min": "Mật khẩu phải có ít nhất 6 ký tự",
			"string.pattern.base":
				"Mật khẩu phải chứa ít nhất 1 số và 1 chữ cái viết hoa",
		}),
	firstName: Joi.string().max(50).required(),
	lastName: Joi.string().max(50).required(),
	phone: Joi.string()
		.pattern(/^[0-9]{10,11}$/)
		.optional(),
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string()
		.min(6)
		.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/)
		.required()
		.messages({
			"string.min": "Mật khẩu phải có ít nhất 6 ký tự",
			"string.pattern.base":
				"Mật khẩu phải chứa ít nhất 1 số và 1 chữ cái viết hoa",
		}),
});

const updateProfileSchema = Joi.object({
	firstName: Joi.string().max(50).optional(),
	lastName: Joi.string().max(50).optional(),
	phone: Joi.string()
		.pattern(/^[0-9]{10,11}$/)
		.optional(),
});

const changePasswordSchema = Joi.object({
	currentPassword: Joi.string()
		.min(6)
		.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/)
		.required()
		.messages({
			"string.min": "Mật khẩu hiện tại phải có ít nhất 6 ký tự",
			"string.pattern.base":
				"Mật khẩu hiện tại phải chứa ít nhất 1 số và 1 chữ cái viết hoa",
		}),
	newPassword: Joi.string()
		.min(6)
		.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/)
		.invalid(Joi.ref("currentPassword"))
		.required()
		.messages({
			"string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
			"string.pattern.base":
				"Mật khẩu mới phải chứa ít nhất 1 số và 1 chữ cái viết hoa",
			"any.invalid": "Mật khẩu mới không được giống mật khẩu hiện tại",
		}),
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
